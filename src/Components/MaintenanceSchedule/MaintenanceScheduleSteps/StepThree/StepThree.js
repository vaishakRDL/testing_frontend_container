// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   Typography,
//   FormControl,
//   FormControlLabel,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
//   Button,
//   Divider,
//   alpha,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import { ToolUOMShowList } from "../../../../ApiService/LoginPageService";

// /* ─── design tokens ──────────────────────────────────────────────────────── */
// const BRAND = {
//   primary: "#0F62FE",
//   border: "#E2E6EA",
//   text: "#1A1A2E",
//   muted: "#6B7280",
// };

// /* ─── label ──────────────────────────────────────────────────────────────── */
// function Label({ children }) {
//   return (
//     <Typography sx={{
//       fontSize: "0.8rem", fontWeight: 700, color: BRAND.text,
//       mb: 0.75, display: "block", textAlign: "left",
//     }}>
//       {children}
//     </Typography>
//   );
// }

// /* ─── shared styles ──────────────────────────────────────────────────────── */
// const fieldSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px", height: "44px", background: "#fff",
//     "& input": { padding: "0 14px", height: "44px", boxSizing: "border-box", fontSize: "0.875rem", fontWeight: 600, color: BRAND.text },
//     "& fieldset": { borderColor: BRAND.border, borderWidth: "1.5px" },
//     "&:hover fieldset": { borderColor: BRAND.primary },
//     "&.Mui-focused fieldset": { borderColor: BRAND.primary, borderWidth: "2px" },
//   },
//   "& .MuiInputLabel-root": { display: "none" },
//   "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
//   "& .MuiOutlinedInput-notchedOutline": { top: 0 },
// };

// const selectSx = {
//   borderRadius: "8px", height: "44px", background: "#fff",
//   "& .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.border, borderWidth: "1.5px", top: 0 },
//   "& legend": { display: "none" },
//   "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary },
//   "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary, borderWidth: "2px" },
//   "& .MuiSelect-select": {
//     height: "44px !important", display: "flex", alignItems: "center",
//     padding: "0 14px", fontSize: "0.875rem", fontWeight: 600, color: BRAND.text, boxSizing: "border-box",
//   },
// };

// const menuProps = {
//   PaperProps: {
//     sx: {
//       mt: 0.5, borderRadius: "8px", border: `1px solid ${BRAND.border}`,
//       boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//       "& .MuiMenuItem-root": {
//         fontSize: "0.875rem", fontWeight: 500, color: BRAND.text, py: 1,
//         "&:hover": { bgcolor: alpha(BRAND.primary, 0.06) },
//         "&.Mui-selected": { bgcolor: alpha(BRAND.primary, 0.08), color: BRAND.primary, fontWeight: 700 },
//       },
//     },
//   },
// };

// /* ─── columns ────────────────────────────────────────────────────────────── */
// const buildColumns = (onDelete) => [
//   { field: "id", headerName: "ID", flex: 0.5, minWidth: 50, align: "center", headerAlign: "center" },
//   { field: "Name", headerName: "Name", flex: 1, minWidth: 90, align: "center", headerAlign: "center" },
//   { field: "PartId", headerName: "Part ID", flex: 1, minWidth: 80, align: "center", headerAlign: "center" },
//   { field: "Quantity", headerName: "Qty", flex: 0.7, minWidth: 70, align: "center", headerAlign: "center" },
//   { field: "UOM", headerName: "Units", flex: 0.7, minWidth: 70, align: "center", headerAlign: "center" },
//   { field: "Unitprice", headerName: "Amount", flex: 1, minWidth: 80, align: "center", headerAlign: "center" },
//   {
//     field: "Action", headerName: "", width: 60, align: "center", headerAlign: "center", sortable: false,
//     renderCell: (params) => (
//       <Box onClick={() => onDelete(params.id)} sx={{
//         display: "inline-flex", alignItems: "center", justifyContent: "center",
//         width: 30, height: 30, borderRadius: "7px", cursor: "pointer",
//         bgcolor: alpha("#FF4D4F", 0.08), color: "#FF4D4F",
//         border: `1px solid ${alpha("#FF4D4F", 0.2)}`,
//         "&:hover": { bgcolor: alpha("#FF4D4F", 0.16) },
//         transition: "background 0.15s",
//       }}>
//         <DeleteIcon sx={{ fontSize: 16 }} />
//       </Box>
//     ),
//   },
// ];

// /* ─── component ──────────────────────────────────────────────────────────── */
// const StepThree = ({ setStepThreeValues, stepThreeValues, rows, setRows }) => {

//   const [unitlist, setUnitlist] = useState([]);

//   const set = (key) => (e) =>
//     setStepThreeValues((p) => ({ ...p, [key]: e.target.value }));

//   const handleAdd = () => {
//     const newRow = {
//       id: rows.length + 1,
//       Type: stepThreeValues.Type,
//       Name: stepThreeValues.Name,
//       PartId: stepThreeValues.Partid,
//       Quantity: stepThreeValues.Quantity,
//       UOM: stepThreeValues.UOM,
//       Unitprice: stepThreeValues.Unitprice,
//     };
//     const next = [...rows, newRow];
//     localStorage.setItem("rows", JSON.stringify(next));
//     setRows(next);
//     setStepThreeValues({ Type: "", Name: "", Partid: "", Quantity: "", UOM: "", Unitprice: "" });
//   };

//   const handleDeleteRow = (id) => {
//     const next = rows.filter((r) => r.id !== id);
//     localStorage.setItem("rows", JSON.stringify(next));
//     setRows(next);
//   };

//   useEffect(() => {
//     const stored = localStorage.getItem("rows");
//     if (stored) setRows(JSON.parse(stored));
//     ToolUOMShowList(
//       (data) => {
//         setUnitlist(data);
//       },
//       (error) => {
//         // Handle error if needed
//       }

//     );
//   }, []);

//   const columns = buildColumns(handleDeleteRow);

//   return (
//     <Card elevation={0} sx={{ mt: 2, borderRadius: "16px", border: "1.5px solid #E2E6EA", background: "#fff", overflow: "visible" }}>
//       <CardContent sx={{ p: "24px !important" }}>

//         {/* header */}
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
//           <Box>
//             <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: BRAND.text, lineHeight: 1.2 }}>
//               Parts &amp; Consumables
//             </Typography>
//             <Typography sx={{ fontSize: "0.75rem", color: BRAND.muted, mt: 0.3 }}>
//               Add parts or consumables used during maintenance
//             </Typography>
//           </Box>
//           {/* <Box sx={{ px: 1.5, py: 0.4, borderRadius: "20px", bgcolor: BRAND.primary, color: "#fff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em" }}>
//             STEP 03
//           </Box> */}
//         </Box>

//         <Divider sx={{ borderColor: "#E2E6EA", mb: 3 }} />

//         <Grid container spacing={3} alignItems="flex-start">

//           {/* ── LEFT: form panel ── */}
//           <Grid item xs={12} md={5}>
//             <Box sx={{
//               p: 2.5, borderRadius: "12px",
//               border: "1.5px solid #E2E6EA",
//               background: "#FAFAFA",
//             }}>

//               {/* Type radio */}
//               <Box sx={{ mb: 2 }}>
//                 <Label>Type</Label>
//                 <RadioGroup row value={stepThreeValues.Type}
//                   onChange={(e) => setStepThreeValues((p) => ({ ...p, Type: e.target.value }))}
//                   sx={{ gap: 1 }}
//                 >
//                   {["Parts", "Consumable", "NA"].map((val) => (
//                     <FormControlLabel
//                       key={val} value={val} label={val}
//                       control={<Radio size="small" sx={{ color: BRAND.border, "&.Mui-checked": { color: BRAND.primary }, p: 0.5 }} />}
//                       sx={{
//                         m: 0, px: 1.5, py: 0.75, borderRadius: "8px",
//                         border: `1.5px solid ${stepThreeValues.Type === val ? BRAND.primary : BRAND.border}`,
//                         bgcolor: stepThreeValues.Type === val ? alpha(BRAND.primary, 0.05) : "#fff",
//                         transition: "all 0.15s",
//                         "& .MuiFormControlLabel-label": {
//                           fontSize: "0.82rem",
//                           fontWeight: stepThreeValues.Type === val ? 700 : 500,
//                           color: stepThreeValues.Type === val ? BRAND.primary : BRAND.text,
//                         },
//                       }}
//                     />
//                   ))}
//                 </RadioGroup>
//               </Box>

//               {/* ── 2-column field grid ── */}
//               <Grid container spacing={1.5} alignItems="flex-start">

//                 <Grid item xs={6}>
//                   <Label>Name</Label>
//                   <TextField fullWidth size="small" placeholder="Enter name"
//                     value={stepThreeValues.Name} onChange={set("Name")} sx={fieldSx} />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Part ID</Label>
//                   <TextField fullWidth size="small" placeholder="Enter part ID"
//                     value={stepThreeValues.Partid} onChange={set("Partid")} sx={fieldSx} />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Quantity</Label>
//                   <TextField fullWidth size="small" placeholder="Enter quantity"
//                     value={stepThreeValues.Quantity} onChange={set("Quantity")} sx={fieldSx} />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Units</Label>
//                   <FormControl fullWidth size="small">
//                     <Select value={stepThreeValues.UOM}
//                       onChange={(e) => setStepThreeValues((p) => ({ ...p, UOM: e.target.value }))}
//                       displayEmpty sx={selectSx} MenuProps={menuProps}
//                     >
//                       <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select unit</span></MenuItem>
//                       {unitlist.map((data) => (
//                         <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Unit Price</Label>
//                   <TextField fullWidth size="small" placeholder="Enter unit price"
//                     value={stepThreeValues.Unitprice} onChange={set("Unitprice")} sx={fieldSx} />
//                 </Grid>

//                 {/* Add button aligned with last field */}
//                 <Grid item xs={6} sx={{ display: "flex", alignItems: "flex-end", mt: 3 }}>
//                   <Button fullWidth onClick={handleAdd} startIcon={<AddIcon />} sx={{

//                     height: "44px", borderRadius: "8px",
//                     bgcolor: BRAND.primary, color: "#fff",
//                     fontWeight: 700, fontSize: "0.875rem",
//                     textTransform: "none", boxShadow: "none",
//                     "&:hover": { bgcolor: "#0050D8", boxShadow: "none" },
//                   }}>
//                     Add Item
//                   </Button>
//                 </Grid>

//               </Grid>
//             </Box>
//           </Grid>

//           {/* ── RIGHT: table ── */}
//           <Grid item xs={12} md={7}>
//             <Box sx={{ borderRadius: "12px", border: "1.5px solid #E2E6EA", overflow: "hidden" }}>
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 autoHeight
//                 pageSize={5}
//                 rowsPerPageOptions={[5, 10, 20]}
//                 disableSelectionOnClick
//                 rowHeight={44}
//                 headerHeight={44}
//                 sx={{
//                   border: "none",
//                   "& .MuiDataGrid-columnHeaders": {
//                     background: "#F3F4F6",
//                     borderBottom: "1.5px solid #E2E6EA",
//                     minHeight: "44px !important", maxHeight: "44px !important",
//                   },
//                   "& .MuiDataGrid-columnHeaderTitle": {
//                     fontWeight: 800, fontSize: "0.75rem",
//                     color: BRAND.text, textTransform: "uppercase", letterSpacing: "0.04em",
//                   },
//                   "& .MuiDataGrid-row": {
//                     minHeight: "44px !important", maxHeight: "44px !important",
//                     "&:hover": { bgcolor: alpha(BRAND.primary, 0.04) },
//                   },
//                   "& .MuiDataGrid-cell": {
//                     borderColor: "#E2E6EA", fontSize: "0.85rem", color: BRAND.text,
//                     minHeight: "44px !important", maxHeight: "44px !important",
//                     "&:focus": { outline: "none" },
//                   },
//                   "& .MuiDataGrid-footerContainer": {
//                     borderTop: "1.5px solid #E2E6EA", background: "#FAFAFA",
//                     minHeight: "44px !important",
//                   },
//                 }}
//               />
//             </Box>
//           </Grid>

//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default StepThree;


// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {
//   alpha,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import { ToolUOMShowList } from "../../../../ApiService/LoginPageService";

// // ─── Constants ───────────────────────────────────────────────────────────────

// const BRAND = {
//   primary: "#0F62FE",
//   border: "#E2E6EA",
//   text: "#1A1A2E",
//   muted: "#6B7280",
//   danger: "#FF4D4F",
// };

// const PART_TYPES = ["Parts", "Consumable", "NA"];

// const EMPTY_FORM = {
//   Type: "",
//   Name: "",
//   Partid: "",
//   Quantity: "",
//   UOM: "",
//   Unitprice: "",
// };

// // ─── Shared Styles ───────────────────────────────────────────────────────────

// const fieldSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px",
//     height: "44px",
//     background: "#fff",
//     "& input": {
//       padding: "0 14px",
//       height: "44px",
//       boxSizing: "border-box",
//       fontSize: "0.875rem",
//       fontWeight: 600,
//       color: BRAND.text,
//     },
//     "& fieldset": { borderColor: BRAND.border, borderWidth: "1.5px" },
//     "&:hover fieldset": { borderColor: BRAND.primary },
//     "&.Mui-focused fieldset": { borderColor: BRAND.primary, borderWidth: "2px" },
//   },
//   "& .MuiInputLabel-root": { display: "none" },
//   "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
//   "& .MuiOutlinedInput-notchedOutline": { top: 0 },
// };

// const selectSx = {
//   borderRadius: "8px",
//   height: "44px",
//   background: "#fff",
//   "& .MuiOutlinedInput-notchedOutline": {
//     borderColor: BRAND.border,
//     borderWidth: "1.5px",
//     top: 0,
//   },
//   "& legend": { display: "none" },
//   "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary },
//   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//     borderColor: BRAND.primary,
//     borderWidth: "2px",
//   },
//   "& .MuiSelect-select": {
//     height: "44px !important",
//     display: "flex",
//     alignItems: "center",
//     padding: "0 14px",
//     fontSize: "0.875rem",
//     fontWeight: 600,
//     color: BRAND.text,
//     boxSizing: "border-box",
//   },
// };

// const menuProps = {
//   PaperProps: {
//     sx: {
//       mt: 0.5,
//       borderRadius: "8px",
//       border: `1px solid ${BRAND.border}`,
//       boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//       "& .MuiMenuItem-root": {
//         fontSize: "0.875rem",
//         fontWeight: 500,
//         color: BRAND.text,
//         py: 1,
//         "&:hover": { bgcolor: alpha(BRAND.primary, 0.06) },
//         "&.Mui-selected": {
//           bgcolor: alpha(BRAND.primary, 0.08),
//           color: BRAND.primary,
//           fontWeight: 700,
//         },
//       },
//     },
//   },
// };

// const dataGridSx = {
//   border: "none",
//   "& .MuiDataGrid-columnHeaders": {
//     background: "#F3F4F6",
//     borderBottom: "1.5px solid #E2E6EA",
//     minHeight: "44px !important",
//     maxHeight: "44px !important",
//   },
//   "& .MuiDataGrid-columnHeaderTitle": {
//     fontWeight: 800,
//     fontSize: "0.75rem",
//     color: BRAND.text,
//     textTransform: "uppercase",
//     letterSpacing: "0.04em",
//   },
//   "& .MuiDataGrid-row": {
//     minHeight: "44px !important",
//     maxHeight: "44px !important",
//     "&:hover": { bgcolor: alpha(BRAND.primary, 0.04) },
//   },
//   "& .MuiDataGrid-cell": {
//     borderColor: "#E2E6EA",
//     fontSize: "0.85rem",
//     color: BRAND.text,
//     minHeight: "44px !important",
//     maxHeight: "44px !important",
//     "&:focus": { outline: "none" },
//   },
//   "& .MuiDataGrid-footerContainer": {
//     borderTop: "1.5px solid #E2E6EA",
//     background: "#FAFAFA",
//     minHeight: "44px !important",
//   },
// };

// // ─── Sub-components ──────────────────────────────────────────────────────────

// function Label({ children }) {
//   return (
//     <Typography
//       sx={{
//         fontSize: "0.8rem",
//         fontWeight: 700,
//         color: BRAND.text,
//         mb: 0.75,
//         display: "block",
//         textAlign: "left",
//       }}
//     >
//       {children}
//     </Typography>
//   );
// }

// function DeleteButton({ onClick }) {
//   return (
//     <Box
//       onClick={onClick}
//       sx={{
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: 30,
//         height: 30,
//         borderRadius: "7px",
//         cursor: "pointer",
//         bgcolor: alpha(BRAND.danger, 0.08),
//         color: BRAND.danger,
//         border: `1px solid ${alpha(BRAND.danger, 0.2)}`,
//         "&:hover": { bgcolor: alpha(BRAND.danger, 0.16) },
//         transition: "background 0.15s",
//       }}
//     >
//       <DeleteIcon sx={{ fontSize: 16 }} />
//     </Box>
//   );
// }

// // ─── Column Definitions ───────────────────────────────────────────────────────

// const buildColumns = (onDelete) => [
//   { field: "id", headerName: "ID", flex: 0.5, minWidth: 50, align: "center", headerAlign: "center" },
//   { field: "Name", headerName: "Name", flex: 1, minWidth: 90, align: "center", headerAlign: "center" },
//   { field: "PartId", headerName: "Part ID", flex: 1, minWidth: 80, align: "center", headerAlign: "center" },
//   { field: "Quantity", headerName: "Qty", flex: 0.7, minWidth: 70, align: "center", headerAlign: "center" },
//   { field: "UOM", headerName: "Units", flex: 0.7, minWidth: 70, align: "center", headerAlign: "center" },
//   { field: "Unitprice", headerName: "Amount", flex: 1, minWidth: 80, align: "center", headerAlign: "center" },
//   {
//     field: "Action",
//     headerName: "",
//     width: 60,
//     align: "center",
//     headerAlign: "center",
//     sortable: false,
//     renderCell: (params) => (
//       <DeleteButton onClick={() => onDelete(params.id)} />
//     ),
//   },
// ];

// // ─── Main Component ───────────────────────────────────────────────────────────

// const StepThree = ({ setStepThreeValues, stepThreeValues, rows, setRows }) => {
//   const [unitList, setUnitList] = useState([]);

//   // Generic field setter
//   const set = useCallback(
//     (key) => (e) =>
//       setStepThreeValues((prev) => ({ ...prev, [key]: e.target.value })),
//     [setStepThreeValues]
//   );

//   // Persist rows to localStorage
//   const persistRows = useCallback(
//     (next) => {
//       localStorage.setItem("rows", JSON.stringify(next));
//       setRows(next);
//     },
//     [setRows]
//   );

//   const handleAdd = useCallback(() => {
//     const { Type, Name, Partid, Quantity, UOM, Unitprice } = stepThreeValues;

//     // Basic validation — all fields required
//     if (!Type || !Name || !Partid || !Quantity || !UOM || !Unitprice) return;

//     const newRow = {
//       id: Date.now(), // avoids collision vs rows.length + 1
//       Type,
//       Name,
//       PartId: Partid,
//       Quantity,
//       UOM,
//       Unitprice,
//     };

//     persistRows([...rows, newRow]);
//     setStepThreeValues(EMPTY_FORM);
//   }, [stepThreeValues, rows, persistRows, setStepThreeValues]);

//   const handleDeleteRow = useCallback(
//     (id) => persistRows(rows.filter((r) => r.id !== id)),
//     [rows, persistRows]
//   );

//   // Load stored rows + fetch UOM list once on mount
//   useEffect(() => {
//     const stored = localStorage.getItem("rows");
//     if (stored) setRows(JSON.parse(stored));

//     // ✅ Correct — extract the nested array
//     ToolUOMShowList(
//       (data) => setUnitList(Array.isArray(data?.data) ? data.data : []),
//       (error) => console.error("Failed to load UOM list:", error)
//     );
//   }, [setRows]);

//   const columns = useMemo(() => buildColumns(handleDeleteRow), [handleDeleteRow]);

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         mt: 2,
//         borderRadius: "16px",
//         border: "1.5px solid #E2E6EA",
//         background: "#fff",
//         overflow: "visible",
//       }}
//     >
//       <CardContent sx={{ p: "24px !important" }}>

//         {/* Header */}
//         <Box sx={{ mb: 3 }}>
//           <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: BRAND.text, lineHeight: 1.2 }}>
//             Parts &amp; Consumables
//           </Typography>
//           <Typography sx={{ fontSize: "0.75rem", color: BRAND.muted, mt: 0.3 }}>
//             Add parts or consumables used during maintenance
//           </Typography>
//         </Box>

//         <Divider sx={{ borderColor: "#E2E6EA", mb: 3 }} />

//         <Grid container spacing={3} alignItems="flex-start">

//           {/* ── LEFT: Form Panel ── */}
//           <Grid item xs={12} md={5}>
//             <Box sx={{ p: 2.5, borderRadius: "12px", border: "1.5px solid #E2E6EA", background: "#FAFAFA" }}>

//               {/* Type */}
//               <Box sx={{ mb: 2 }}>
//                 <Label>Type</Label>
//                 <RadioGroup
//                   row
//                   value={stepThreeValues.Type}
//                   onChange={(e) =>
//                     setStepThreeValues((prev) => ({ ...prev, Type: e.target.value }))
//                   }
//                   sx={{ gap: 1 }}
//                 >
//                   {PART_TYPES.map((val) => (
//                     <FormControlLabel
//                       key={val}
//                       value={val}
//                       label={val}
//                       control={
//                         <Radio
//                           size="small"
//                           sx={{
//                             color: BRAND.border,
//                             "&.Mui-checked": { color: BRAND.primary },
//                             p: 0.5,
//                           }}
//                         />
//                       }
//                       sx={{
//                         m: 0,
//                         px: 1.5,
//                         py: 0.75,
//                         borderRadius: "8px",
//                         border: `1.5px solid ${stepThreeValues.Type === val ? BRAND.primary : BRAND.border
//                           }`,
//                         bgcolor:
//                           stepThreeValues.Type === val
//                             ? alpha(BRAND.primary, 0.05)
//                             : "#fff",
//                         transition: "all 0.15s",
//                         "& .MuiFormControlLabel-label": {
//                           fontSize: "0.82rem",
//                           fontWeight: stepThreeValues.Type === val ? 700 : 500,
//                           color:
//                             stepThreeValues.Type === val ? BRAND.primary : BRAND.text,
//                         },
//                       }}
//                     />
//                   ))}
//                 </RadioGroup>
//               </Box>

//               {/* Fields */}
//               <Grid container spacing={1.5} alignItems="flex-start">
//                 <Grid item xs={6}>
//                   <Label>Name</Label>
//                   <TextField
//                     fullWidth size="small" placeholder="Enter name"
//                     value={stepThreeValues.Name} onChange={set("Name")} sx={fieldSx}
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Part ID</Label>
//                   <TextField
//                     fullWidth size="small" placeholder="Enter part ID"
//                     value={stepThreeValues.Partid} onChange={set("Partid")} sx={fieldSx}
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Quantity</Label>
//                   <TextField
//                     fullWidth size="small" placeholder="Enter quantity"
//                     value={stepThreeValues.Quantity} onChange={set("Quantity")} sx={fieldSx}
//                   />
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Units</Label>
//                   <FormControl fullWidth size="small">
//                     <Select
//                       value={stepThreeValues.UOM}
//                       onChange={(e) =>
//                         setStepThreeValues((prev) => ({ ...prev, UOM: e.target.value }))
//                       }
//                       displayEmpty
//                       sx={selectSx}
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="" disabled>
//                         <span style={{ color: BRAND.muted }}>Select unit</span>
//                       </MenuItem>
//                       {unitList.map((unit) => (
//                         <MenuItem key={unit.id} value={unit.name}>
//                           {unit.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={6}>
//                   <Label>Unit Price</Label>
//                   <TextField
//                     fullWidth size="small" placeholder="Enter unit price"
//                     value={stepThreeValues.Unitprice} onChange={set("Unitprice")} sx={fieldSx}
//                   />
//                 </Grid>

//                 {/* Add Button */}
//                 <Grid item xs={6} sx={{ display: "flex", alignItems: "flex-end", mt: 3 }}>
//                   <Button
//                     fullWidth
//                     onClick={handleAdd}
//                     startIcon={<AddIcon />}
//                     sx={{
//                       height: "44px",
//                       borderRadius: "8px",
//                       bgcolor: BRAND.primary,
//                       color: "#fff",
//                       fontWeight: 700,
//                       fontSize: "0.875rem",
//                       textTransform: "none",
//                       boxShadow: "none",
//                       "&:hover": { bgcolor: "#0050D8", boxShadow: "none" },
//                     }}
//                   >
//                     Add Item
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>

//           {/* ── RIGHT: Data Table ── */}
//           <Grid item xs={12} md={7}>
//             <Box sx={{ borderRadius: "12px", border: "1.5px solid #E2E6EA", overflow: "hidden" }}>
//               <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 autoHeight
//                 pageSize={5}
//                 rowsPerPageOptions={[5, 10, 20]}
//                 disableSelectionOnClick
//                 rowHeight={44}
//                 headerHeight={44}
//                 sx={dataGridSx}
//               />
//             </Box>
//           </Grid>

//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default StepThree;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ToolUOMShowList } from "../../../../ApiService/LoginPageService";

// ─── Constants ───────────────────────────────────────────────────────────────

const BRAND = {
  primary: "#0F62FE",
  border: "#E2E6EA",
  text: "#1A1A2E",
  muted: "#6B7280",
  danger: "#FF4D4F",
};

const PART_TYPES = ["Parts", "Consumable", "NA"];

const EMPTY_FORM = {
  Type: "",
  Name: "",
  Partid: "",
  Quantity: "",
  UOM: "",
  Unitprice: "",
};

// ─── Shared Styles ───────────────────────────────────────────────────────────

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "44px",
    background: "#fff",
    "& input": {
      padding: "0 14px",
      height: "44px",
      boxSizing: "border-box",
      fontSize: "0.875rem",
      fontWeight: 600,
      color: BRAND.text,
    },
    "& fieldset": { borderColor: BRAND.border, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: BRAND.primary },
    "&.Mui-focused fieldset": {
      borderColor: BRAND.primary,
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline": { top: 0 },
};

const selectSx = {
  borderRadius: "8px",
  height: "44px",
  background: "#fff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND.border,
    borderWidth: "1.5px",
    top: 0,
  },
  "& legend": { display: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND.primary,
    borderWidth: "2px",
  },
  "& .MuiSelect-select": {
    height: "44px !important",
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: BRAND.text,
    boxSizing: "border-box",
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      mt: 0.5,
      borderRadius: "8px",
      border: `1px solid ${BRAND.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      "& .MuiMenuItem-root": {
        fontSize: "0.875rem",
        fontWeight: 500,
        color: BRAND.text,
        py: 1,
        "&:hover": { bgcolor: alpha(BRAND.primary, 0.06) },
        "&.Mui-selected": {
          bgcolor: alpha(BRAND.primary, 0.08),
          color: BRAND.primary,
          fontWeight: 700,
        },
      },
    },
  },
};

const dataGridSx = {
  border: "none",
  "& .MuiDataGrid-columnHeaders": {
    background: "#F3F4F6",
    borderBottom: "1.5px solid #E2E6EA",
    minHeight: "44px !important",
    maxHeight: "44px !important",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 800,
    fontSize: "0.75rem",
    color: BRAND.text,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  "& .MuiDataGrid-row": {
    minHeight: "44px !important",
    maxHeight: "44px !important",
    "&:hover": { bgcolor: alpha(BRAND.primary, 0.04) },
  },
  "& .MuiDataGrid-cell": {
    borderColor: "#E2E6EA",
    fontSize: "0.85rem",
    color: BRAND.text,
    minHeight: "44px !important",
    maxHeight: "44px !important",
    "&:focus": { outline: "none" },
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1.5px solid #E2E6EA",
    background: "#FAFAFA",
    minHeight: "44px !important",
  },
};

// ─── Sub Components ──────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <Typography
      sx={{
        fontSize: "0.8rem",
        fontWeight: 700,
        color: BRAND.text,
        mb: 0.75,
        display: "block",
        textAlign: "left",
      }}
    >
      {children}
    </Typography>
  );
}

function DeleteButton({ onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: "7px",
        cursor: "pointer",
        bgcolor: alpha(BRAND.danger, 0.08),
        color: BRAND.danger,
        border: `1px solid ${alpha(BRAND.danger, 0.2)}`,
        "&:hover": { bgcolor: alpha(BRAND.danger, 0.16) },
        transition: "background 0.15s",
      }}
    >
      <DeleteIcon sx={{ fontSize: 16 }} />
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const StepThree = ({ setStepThreeValues, stepThreeValues, rows, setRows }) => {
  const [unitList, setUnitList] = useState([]);

  // Generic field setter
  const handleFieldChange = useCallback(
    (key) => (event) => {
      const value = event.target.value;
      setStepThreeValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setStepThreeValues]
  );

  const handleTypeChange = useCallback(
    (event) => {
      setStepThreeValues((prev) => ({
        ...prev,
        Type: event.target.value,
      }));
    },
    [setStepThreeValues]
  );

  const handleUomChange = useCallback(
    (event) => {
      setStepThreeValues((prev) => ({
        ...prev,
        UOM: event.target.value,
      }));
    },
    [setStepThreeValues]
  );

  const handleAdd = useCallback(() => {
    const { Type, Name, Partid, Quantity, UOM, Unitprice } = stepThreeValues;

    if (
      !Type?.trim() ||
      !Name?.trim() ||
      !Partid?.trim() ||
      !String(Quantity)?.trim() ||
      !UOM?.trim() ||
      !String(Unitprice)?.trim()
    ) {
      return;
    }

    const newRow = {
      rowId:
        rows.length > 0
          ? Math.max(...rows.map((item) => item.rowId || 0)) + 1
          : 1,
      Type: Type.trim(),
      Name: Name.trim(),
      PartId: Partid.trim(),
      Quantity: Quantity,
      UOM: UOM.trim(),
      Unitprice: Unitprice,
    };

    setRows((prev) => [...prev, newRow]);
    setStepThreeValues(EMPTY_FORM);
  }, [rows, setRows, setStepThreeValues, stepThreeValues]);

  const handleDeleteRow = useCallback(
    (rowId) => {
      setRows((prev) => prev.filter((row) => row.rowId !== rowId));
    },
    [setRows]
  );

  useEffect(() => {
    ToolUOMShowList(
      (data) => {
        setUnitList(Array.isArray(data?.data) ? data.data : []);
      },
      (error) => {
        console.error("Failed to load UOM list:", error);
        setUnitList([]);
      }
    );
  }, []);

  const displayRows = useMemo(() => {
    return rows.map((row, index) => ({
      ...row,
      id: row.rowId,
      slNo: index + 1,
    }));
  }, [rows]);

  const columns = useMemo(
    () => [
      {
        field: "slNo",
        headerName: "SL No",
        flex: 0.6,
        minWidth: 70,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "Type",
        headerName: "Type",
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "Name",
        headerName: "Name",
        flex: 1.2,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "PartId",
        headerName: "Part ID",
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "Quantity",
        headerName: "Qty",
        flex: 0.7,
        minWidth: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "UOM",
        headerName: "Units",
        flex: 0.8,
        minWidth: 90,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "Unitprice",
        headerName: "Unit Price",
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "Action",
        headerName: "",
        width: 70,
        align: "center",
        headerAlign: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <DeleteButton onClick={() => handleDeleteRow(params.row.rowId)} />
        ),
      },
    ],
    [handleDeleteRow]
  );

  return (
    <Card
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: "16px",
        border: "1.5px solid #E2E6EA",
        background: "#fff",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: "24px !important" }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: "1.05rem",
              color: BRAND.text,
              lineHeight: 1.2,
            }}
          >
            Parts &amp; Consumables
          </Typography>
          <Typography
            sx={{ fontSize: "0.75rem", color: BRAND.muted, mt: 0.3 }}
          >
            Add parts or consumables used during maintenance
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#E2E6EA", mb: 3 }} />

        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                border: "1.5px solid #E2E6EA",
                background: "#FAFAFA",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Label>Type</Label>
                <RadioGroup
                  row
                  value={stepThreeValues.Type}
                  onChange={handleTypeChange}
                  sx={{ gap: 1 }}
                >
                  {PART_TYPES.map((val) => (
                    <FormControlLabel
                      key={val}
                      value={val}
                      label={val}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: BRAND.border,
                            "&.Mui-checked": { color: BRAND.primary },
                            p: 0.5,
                          }}
                        />
                      }
                      sx={{
                        m: 0,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: "8px",
                        border: `1.5px solid ${stepThreeValues.Type === val
                            ? BRAND.primary
                            : BRAND.border
                          }`,
                        bgcolor:
                          stepThreeValues.Type === val
                            ? alpha(BRAND.primary, 0.05)
                            : "#fff",
                        transition: "all 0.15s",
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.82rem",
                          fontWeight: stepThreeValues.Type === val ? 700 : 500,
                          color:
                            stepThreeValues.Type === val
                              ? BRAND.primary
                              : BRAND.text,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </Box>

              <Grid container spacing={1.5} alignItems="flex-start">
                <Grid item xs={6}>
                  <Label>Name</Label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter name"
                    value={stepThreeValues.Name}
                    onChange={handleFieldChange("Name")}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Label>Part ID</Label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter part ID"
                    value={stepThreeValues.Partid}
                    onChange={handleFieldChange("Partid")}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Label>Quantity</Label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter quantity"
                    value={stepThreeValues.Quantity}
                    onChange={handleFieldChange("Quantity")}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Label>Units</Label>
                  <FormControl fullWidth size="small">
                    <Select
                      value={stepThreeValues.UOM}
                      onChange={handleUomChange}
                      displayEmpty
                      sx={selectSx}
                      MenuProps={menuProps}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: BRAND.muted }}>Select unit</span>
                      </MenuItem>
                      {unitList.map((unit, index) => (
                        <MenuItem
                          key={unit.id || unit.name || index}
                          value={unit.name}
                        >
                          {unit.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <Label>Unit Price</Label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter unit price"
                    value={stepThreeValues.Unitprice}
                    onChange={handleFieldChange("Unitprice")}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", alignItems: "flex-end", mt: 3 }}
                >
                  <Button
                    fullWidth
                    onClick={handleAdd}
                    startIcon={<AddIcon />}
                    sx={{
                      height: "44px",
                      borderRadius: "8px",
                      bgcolor: BRAND.primary,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#0050D8", boxShadow: "none" },
                    }}
                  >
                    Add Item
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box
              sx={{
                borderRadius: "12px",
                border: "1.5px solid #E2E6EA",
                overflow: "hidden",
              }}
            >
              <DataGrid
                rows={displayRows}
                columns={columns}
                autoHeight
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                rowHeight={44}
                headerHeight={44}
                sx={dataGridSx}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StepThree;