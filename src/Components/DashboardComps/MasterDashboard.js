// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Button,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Box,
//   Stack,
//   Avatar,
// } from "@mui/material";
// import React, { useState } from "react";
// import {
//   BuildCircle,
//   ShoppingCart,
//   Bolt,
//   LocalGasStation,
//   WarningAmber,
//   Build,
// } from "@mui/icons-material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import BuildIcon from "@mui/icons-material/Build";
// import FactCheckIcon from "@mui/icons-material/FactCheck";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import StoreIcon from "@mui/icons-material/Store";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import ConstructionIcon from "@mui/icons-material/Construction";

// const MasterDashboard = () => {
//   const cardItems = [
//     "Maintenance",
//     "Quality",
//     "Dispatch",
//     "Production",
//     "Purchase",
//     "Store",
//     "Account",
//     "Planning",
//     "NPD And Tool",
//   ];

//   const [open, setOpen] = useState(false);
//   const [selectedCard, setSelectedCard] = useState("");

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const PRIMARY = "#002D68"; // Brand Color
//   const LIGHT_BG = "#F5F8FF"; // Clean Background
//   const LIGHT_CARD = "#E7EEF8"; // Soft Cards
//   const TINT_CARD = "#EDF3FF"; // Small Card Tint

//   const sections = [
//     {
//       title: "Production",
//       icon: <PrecisionManufacturingIcon />,
//       color: "#7b1fa2",
//       cards: [
//         { label: "Shift Output", value: 45 },
//         { label: "Target", value: 30 },
//         { label: "Achieved", value: 51 },
//         { label: "OEE %", value: 77 },
//       ],
//     },
//     {
//       title: "Quality",
//       icon: <FactCheckIcon />,
//       color: "#388e3c",
//       cards: [
//         { label: "OK Parts", value: 78 },
//         { label: "Rejections", value: 8 },
//         { label: "Rework", value: 35 },
//         { label: "Audit Score", value: 57 },
//       ],
//     },
//     {
//       title: "Maintenance",
//       icon: <BuildIcon />,
//       color: "#1976d2",
//       cards: [
//         { label: "Capacity Utilization", value: 23 },
//         { label: "Planned Jobs", value: 45 },
//         { label: "Completed Jobs", value: 56 },
//         { label: "Breakdowns", value: 12 },
//       ],
//     },
//     {
//       title: "Dispatch",
//       icon: <LocalShippingIcon />,
//       color: "#f57c00",
//       cards: [
//         { label: "Today's Dispatch", value: 2 },
//         { label: "Pending", value: 5 },
//         { label: "On Hold", value: 12 },
//         { label: "Total Orders", value: 67 },
//       ],
//     },
//     {
//       title: "Purchase",
//       icon: <ShoppingCartIcon />,
//       color: "#0097a7",
//       cards: [
//         { label: "PO Raised", value: 4 },
//         { label: "PO Pending", value: 7 },
//         { label: "Vendors", value: 34 },
//         { label: "On-Time %", value: 90 },
//       ],
//     },
//     {
//       title: "Store",
//       icon: <StoreIcon />,
//       color: "#c2185b",
//       cards: [
//         { label: "Stock Value", value: 62 },
//         { label: "Fast Moving", value: 22 },
//         { label: "Slow Moving", value: 28 },
//         { label: "Stock-Out", value: 11 },
//       ],
//     },
//     {
//       title: "Accounts",
//       icon: <AccountBalanceIcon />,
//       color: "#5d4037",
//       cards: [
//         { label: "Invoices", value: 8 },
//         { label: "Pending Bills", value: 9 },
//         { label: "Payments", value: 10 },
//         { label: "Overdue", value: 23 },
//       ],
//     },
//     {
//       title: "Planning",
//       icon: <CalendarMonthIcon />,
//       color: "#0288d1",
//       cards: [
//         { label: "Today's Plan", value: 5 },
//         { label: "Completed", value: 36 },
//         { label: "In Progress", value: 78 },
//         { label: "Delayed", value: 33 },
//       ],
//     },
//     {
//       title: "NPD & Tool",
//       icon: <ConstructionIcon />,
//       color: "#8d6e63",
//       cards: [
//         { label: "New Projects", value: 23 },
//         { label: "Proto Built", value: 23 },
//         { label: "Trials", value: 23 },
//         { label: "Tool Changes", value: 23 },
//       ],
//     },
//   ];

//   return (
//     <div
//       style={{
//         height: "80vh",
//         width: "100%",
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Box
//         sx={{
//           boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
//           mt: 2,
//           borderRadius: "10px",
//           width: "98%",
//           height: "100%",
//           overflowY: "auto",
//           p: 2.5,
//           // Soft blue background matching #002D68 theme
//           background: "linear-gradient(135deg, #f5f7fb 0%, #dde7f7 100%)",
//         }}
//       >
//         {/* === Dashboard Title === */}
//         {/* <Typography
//         sx={{
//           fontWeight: "bold",
//           fontSize: "22px",
//           mb: 2,
//           color: PRIMARY,
//         }}
//       >
//         Plant Overview Dashboard
//       </Typography> */}

//         {/* === Grid of Sections (3 x 3) === */}
//         <Grid container spacing={2}>
//           {sections.map((section, index) => (
//             <Grid
//               item
//               xs={12}
//               sm={6}
//               md={4}
//               key={section.title + index}
//               sx={{ display: "flex" }}
//             >
//               <Card
//                 sx={{
//                   flexGrow: 1,
//                   boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
//                   height: 240,
//                   p: 1.5,
//                   borderRadius: "16px",
//                   backgroundColor: "#ffffff",
//                   display: "flex",
//                   flexDirection: "column",
//                   borderTop: `4px solid ${PRIMARY}`, // Brand accent
//                   transition: "transform 0.2s ease, box-shadow 0.2s ease",
//                   "&:hover": {
//                     transform: "translateY(-3px)",
//                     boxShadow: "0px 8px 20px rgba(0,0,0,0.22)",
//                   },
//                 }}
//               >
//                 <CardContent sx={{ p: 0, height: "100%" }}>
//                   {/* Header with Icon & Title */}
//                   <Stack
//                     direction="row"
//                     alignItems="center"
//                     justifyContent="center"
//                     spacing={1.2}
//                     sx={{ mb: 2 }}
//                   >
//                     <Avatar
//                       sx={{
//                         width: 34,
//                         height: 34,
//                         bgcolor: PRIMARY,
//                         boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
//                       }}
//                     >
//                       {section.icon}
//                     </Avatar>

//                     <Typography
//                       sx={{
//                         fontWeight: "bold",
//                         fontSize: "18px",
//                         color: PRIMARY,
//                         textAlign: "center",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {section.title}
//                     </Typography>
//                   </Stack>

//                   {/* 4 Small Cards */}
//                   <Grid container spacing={1}>
//                     {section.cards.map((card, idx) => (
//                       <Grid item xs={6} key={card.label + idx}>
//                         <Card
//                          onClick={() => handleOpen()}
//                           sx={{
//                             height: 80,
//                             borderRadius: "12px",
//                             p: 0.8,
//                             cursor: "pointer",
//                             boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             // Very light blue tinted panel
//                             background:
//                               "linear-gradient(135deg, #ffffff 0%, #edf2ff 100%)",
//                             border: "1px solid #e1e6f5",
//                           }}
//                         >
//                           <CardContent
//                             sx={{
//                               p: 0.5,
//                               textAlign: "center",
//                             }}
//                           >
//                             <Typography
//                               sx={{
//                                 fontSize: "13px",
//                                 opacity: 0.75,
//                                 lineHeight: 1.25,
//                                 marginTop: 3,
//                                 color: "#4b5675",
//                               }}
//                             >
//                               {card.label}
//                             </Typography>
//                             <Typography
//                               sx={{
//                                 fontWeight: "bold",
//                                 fontSize: "25px",
//                                 mt: 0.5,
//                                 color: PRIMARY,
//                               }}
//                             >
//                               {card.value}
//                             </Typography>
//                           </CardContent>
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Dialog
//         open={open}
//         fullWidth
//         maxWidth={false}
//         PaperProps={{
//           style: {
//             width: "95vw",
//             height: "90vh",
//           },
//         }}
//       >
//         <DialogTitle style={{ fontWeight: "bold", fontSize: "22px" }}>
//           {selectedCard}
//         </DialogTitle>

//         <DialogContent>
//           <Grid container spacing={2} style={{ marginBottom: "10px" }}>
//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* === ROW 2 === */}
//           <Grid container spacing={2} style={{ marginBottom: "10px" }}>
//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* === ROW 3 === */}
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} sm={6} md={4} style={{ display: "flex" }}>
//               {/* TOP SECTION → Month Dropdown + View Button */}

//               <Card
//                 style={{
//                   flexGrow: 1,
//                   boxShadow: "0px 3px 8px rgba(0,0,0,0.25)",
//                   height: "240px",
//                 }}
//               >
//                 <CardContent style={{ height: "100%", padding: "10px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <TextField
//                       select
//                       label="Select Month"
//                       size="small"
//                       // defaultValue={dayjs().month() + 1} // current month number (1–12)
//                       style={{ width: "150px" }}
//                     >
//                       {[
//                         "January",
//                         "February",
//                         "March",
//                         "April",
//                         "May",
//                         "June",
//                         "July",
//                         "August",
//                         "September",
//                         "October",
//                         "November",
//                         "December",
//                       ].map((month, index) => (
//                         <MenuItem key={index} value={index + 1}>
//                           {month}
//                         </MenuItem>
//                       ))}
//                     </TextField>

//                     <Button
//                       variant="contained"
//                       style={{
//                         marginLeft: "10px",
//                         height: "40px",
//                         backgroundColor: "#1976d2",
//                       }}
//                     >
//                       View
//                     </Button>
//                   </div>

//                   <ResponsiveContainer width="100%" height="80%">
//                     <BarChart
//                       data={Array.from({ length: 31 }, (_, i) => ({
//                         day: i + 1,
//                         value: Math.floor(Math.random() * 100), // demo value
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="day" tick={{ fontSize: 8 }} />
//                       <YAxis tick={{ fontSize: 8 }} />
//                       <Tooltip />
//                       <Bar dataKey="value" barSize={6} fill="#1976d2" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </DialogContent>

//         {/* Bottom-right button */}
//         <DialogActions style={{ paddingRight: "20px", paddingBottom: "15px" }}>
//           <Button
//             variant="contained"
//             // color="error"
//             onClick={handleClose}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default MasterDashboard;

// =======================
// 1️⃣ IMPORTS
// =======================

// =======================
// 1. REACT IMPORTS
// =======================
import React, { useCallback, useEffect, useMemo, useState } from "react";

// =======================
// 2. MUI COMPONENTS
// =======================
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  DialogActions,
  Button,
  Divider,
  TextField,
  Skeleton,
} from "@mui/material";

// =======================
// 3. MUI ICONS
// =======================
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import BuildIcon from "@mui/icons-material/Build";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConstructionIcon from "@mui/icons-material/Construction";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";

// =======================
// 4. API IMPORT
// =======================
import {
  AddKPIsettings,
  DashboardApi,
  DispatchDashboardApi,
  KPIGrapgDashboardApi,
} from "../../ApiService/LoginPageService";
import KPIChartCard from "./KPIChartCard";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

// =======================
// 5. COMMON STYLES
// =======================
const PRIMARY_COLOR = "#002D68";

const valueBoxStyle = {
  minWidth: 42,
  height: 26,
  borderRadius: 1,
  border: "1px solid #d6dbe8",
  backgroundColor: "#f5f7fb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: "bold",
};

// =======================
// 6. PROGRESS COLOR LOGIC
// =======================
// Color logic based on normal or reversed scheme
const getProgressColor = (result, actual, scheme = "Normal") => {
  if (!actual || actual === 0) return "#c62828"; // Safety

  const ratio = result / actual;

  if (scheme === "Normal") {
    // Normal: low=red, medium=yellow, high=green
    if (ratio < 0.4) return "#c62828"; // Red
    if (ratio < 0.7) return "#f9a825"; // Yellow
    return "#2e7d32"; // Green
  } else if (scheme === "Reverse") {
    // Reverse: low=green, medium=yellow, high=red
    if (ratio < 0.4) return "#2e7d32"; // Green
    if (ratio < 0.7) return "#f9a825"; // Yellow
    return "#c62828"; // Red
  }
};

// KPIItem with colorScheme
const KPIItem = ({ label, result, actual, colorScheme = "Normal" }) => {
  const progressPercent = actual ? Math.min((result / actual) * 100, 100) : 0;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
      <Typography sx={{ flex: 1.8, fontSize: 13, fontWeight: 700 }}>
        {label}
      </Typography>

      <Box
        sx={{
          flex: 1.2,
          height: 8,
          borderRadius: 10,
          backgroundColor: "#e0e0e0",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${progressPercent}%`,
            height: "100%",
            backgroundColor: getProgressColor(result, actual, colorScheme),
            borderRadius: 10,
          }}
        />
      </Box>

      <Box
        sx={{
          minWidth: 42,
          height: 26,
          borderRadius: "6px",
          border: "1px solid #d6dbe8",
          backgroundColor: "#f5f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: "bold",
        }}
      >
        {result}
      </Box>

      <Box
        sx={{
          minWidth: 42,
          height: 26,
          borderRadius: "6px",
          border: "1px solid #d6dbe8",
          backgroundColor: "#e8f0ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: "bold",
        }}
      >
        {actual}
      </Box>
    </Box>
  );
};

// =======================
// 8. MAIN DASHBOARD COMPONENT
// =======================
const MasterDashboard = () => {
  // -----------------------
  // STATE
  // -----------------------
  const PRIMARY = "#002D68";
  const [planningValue, setPlanningValue] = useState(0);
  const [planningTarget, setPlanningTarget] = useState(0);
  const [planningColour, setPlanningColour] = useState("");
  const [preventiveMaintenanceValue, setPreventiveMaintenanceValue] =
    useState(0);
  const [preventiveMaintenanceTarget, setPreventiveMaintenanceTarget] =
    useState(0);
  const [preventiveMaintenanceColour, setPreventiveMaintenanceColour] =
    useState(" ");
  const [powerConsumptionValue, setPowerConsumptionValue] = useState(0);
  const [powerConsumptionTarget, setPowerConsumptionTarget] = useState(0);
  const [powerConsumptionColour, setPowerConsumptionColour] = useState(" ");
  const [dieselGeneratorValue, setDieselGeneratorValue] = useState(0);
  const [dieselGeneratorTarget, setDieselGeneratorTarget] = useState(0);
  const [dieselGeneratorColour, setDieselGeneratorColour] = useState(" ");
  const [breakDownValue, setBreakDownValue] = useState(0);
  const [breakDownTarget, setBreakDownTarget] = useState(0);
  const [breakDownColour, setBreakDownColour] = useState(" ");
  const [OTDRateValue, setOTDRateValue] = useState(0);
  const [OTDRateTarget, setOTDRateTarget] = useState(0);
  const [OTDRateColour, setOTDRateColour] = useState(" ");
  const [vechileCountValue, setVechileCountValue] = useState(0);
  const [vechileCountTarget, setVechileCountTarget] = useState(0);
  const [vechileCountColour, setVechileCountColour] = useState(" ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inwardPPMvalue, setInwardPPMValue] = useState(0);
  const [inwardPPMTarget, setInwardPPMTarget] = useState(0);
  const [inwardPPMColour, setInwardPPMColour] = useState(" ");
  // -----------------------
  const [inprocessRejPPMvalue, setInprocessRejPPMValue] = useState(0);
  const [inprocessRejPPMTarget, setInprocessRejPPMTarget] = useState(0);

  const [inprocessRejPPMColour, setInprocessRejPPMColour] = useState(" ");

  const [inprocessRewPPMvalue, setInprocessRewPPMValue] = useState(0);
  const [inprocessRewPPMTarget, setInprocessRewPPMTarget] = useState(0);

  const [inprocessRewPPMColour, setInprocessRewPPMColour] = useState(" ");

  const [finalPPMvalue, setFinalPPMValue] = useState(0);
  const [finalPPMTarget, setFinalPPMTarget] = useState(0);

  const [finalPPMColour, setFinalPPMColour] = useState(" ");
  // -----------------------

  const [purchaseCostvalue, setPurchaseCostValue] = useState(0);
  const [purchaseCostTarget, setPurchaseCostTarget] = useState(0);

  const [purchaseCostColour, setPurchaseCostColour] = useState(" ");
  // -----------------------
  const [forecastAccuracyvalue, setForecastAccuracyValue] = useState(0);
  const [forecastAccuracyTarget, setForecastAccuracyTarget] = useState(0);

  const [forecastAccuracyColour, setForecastAccuracyColour] = useState(" ");

  const [poAccuracyvalue, setPoAccuracyValue] = useState(0);
  const [poAccuracyTarget, setPoAccuracyTarget] = useState(0);

  const [poAccuracyColour, setPoAccuracyColour] = useState(" ");

  const [inventoryLevelvalue, setInventoryLevelValue] = useState(0);
  const [inventoryLevelTarget, setInventoryLevelTarget] = useState(0);

  const [inventoryLevelColour, setInventoryLevelColour] = useState(" ");
  // -----------------------
  const [inventoryTurnsvalue, setInventoryTurnsValue] = useState(0);
  const [inventoryTurnsTarget, setInventoryTurnsTarget] = useState(0);

  const [inventoryTurnsColour, setInventoryTurnsColour] = useState(" ");

  const [inventoryStockAgevalue, setInventoryStockAgeValue] = useState(0);
  const [inventoryStockAgeTarget, setInventoryStockAgeTarget] = useState(0);

  const [inventoryStockAgeColour, setInventoryStockAgeColour] = useState(" ");
  // -----------------------

  const [inwardDiscrepancyvalue, setInwardDiscrepancyValue] = useState(0);
  const [inwardDiscrepancyTarget, setInwardDiscrepancyTarget] = useState(0);

  const [inwardDiscrepancyColour, setInwardDiscrepancyColour] = useState(" ");

  const [cancelledInvoicevalue, setCancelledInvoiceValue] = useState(0);
  const [cancelledInvoiceTarget, setCancelledInvoiceTarget] = useState(0);

  const [cancelledInvoiceColour, setCancelledInvoiceColour] = useState(" ");
  // -----------------------
  const [pendingPovalue, setPendingPoValue] = useState(0);
  const [pendingPoTarget, setPendingPoTarget] = useState(0);

  const [pendingPoColour, setPendingPoColour] = useState(" ");

  const [creditNotevalue, setCreditNoteValue] = useState(0);
  const [creditNoteTarget, setCreditNoteTarget] = useState(0);

  const [creditNoteColour, setCreditNoteColour] = useState(" ");
  // -----------------------

  const [cutomerDcvalue, setCutomerDcValue] = useState(0);
  const [cutomerDcTarget, setCutomerDcTarget] = useState(0);

  const [cutomerDcColour, setCutomerDcColour] = useState(" ");
  // -----------------------

  const [planVsProductionvalue, setPlanVsProductionValue] = useState(0);
  const [planVsProductionTarget, setPlanVsProductionTarget] = useState(0);

  const [planVsProductionColour, setPlanVsProductionColour] = useState(" ");

  const [capacityUtilizationvalue, setCapacityUtilizationValue] = useState(0);
  const [capacityUtilizationTarget, setCapacityUtilizationTarget] = useState(0);

  const [capacityUtilizationColour, setCapacityUtilizationColour] =
    useState(" ");

  const [machineEfficiencyvalue, setMachineEfficiencyValue] = useState(0);
  const [machineEfficiencyTarget, setMachineEfficiencyTarget] = useState(0);

  const [machineEfficiencyColour, setMachineEfficiencyColour] = useState(" ");

  const [OEEvalue, setOEEValue] = useState(0);
  const [OEETarget, setOEETarget] = useState(0);

  const [OEEColour, setOEEColour] = useState(" ");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  // const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);
  const [targetValues, setTargetValues] = useState({});
  const [kpiSettings, setKpiSettings] = useState({
    // "Plan Vs Production": "reverse",
    // OEE: "normal",
    // "Capacity Utilisation": "normal",
  });
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const [kpiConfig, setKpiConfig] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [kpiList, setKpiList] = useState([]);

  // const [loading, setLoading] = useState(false);
  const openSettings = (section, event) => {
    event?.stopPropagation(); // ✅ SAFE (optional chaining)
    setSelectedSection(section);
    setSettingsOpen(true);
  };

  const openGraphDialog = (section) => {
    setSelectedSection(section);
    setGraphOpen(true);
    setLoading(true);

    KPIGrapgDashboardApi(
      { kpi: section.title }, // ✅ data
      (res) => {
        // ✅ successCallback
        setKpiConfig(res?.config || []);
        setKpiData(res?.data || []);
        setLoading(false);
      },
      (err) => {
        // ✅ errorCallBack (MUST be a function)
        console.error("KPI Graph API Error:", err);
        setLoading(false);
      }
    );
  };

  const handleViewGraph = (data) => {
    console.log("FULL DATA 👉", data);

    console.log("Month 👉", data.month);
    console.log("Code 👉", data.code);
    console.log("Key 👉", data.key);
    console.log("KPI 👉", data.kpi);
  };

  const closeGraphDialog = () => {
    setGraphOpen(false);
    loadDashboard();
  };

  const openKpiSettings = (kpi) => {
    setSelectedKpi({
      ...kpi,
      cs: kpi.cs ?? "Normal",
      value: kpi.value ?? "",
    });
    setSettingsOpen(true);
  };

  const closeSettings = () => {

    setSettingsOpen(false);
    setSelectedKpi(null);

  };

  const updateTarget = (label, value) => {
    setTargetValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };


  // const handleSubmit = () => {
  //   if (!selectedKpi) return;

  //   const payload = {
  //     kpiCode: selectedKpi.kpi_code,
  //     targetValue: selectedKpi.value,
  //     colorScheme: selectedKpi.cs,
  //   };

  //   AddKPIsettings(payload, handlekpisuccess, handlekpierror);
  // };

  const handleSubmit = () => {
    setKpiList((prev) =>
      prev.map((kpi) =>
        kpi.code === selectedKpi.code
          ? {
            ...kpi,
            cs: selectedKpi.cs,
            value: selectedKpi.value,
          }
          : kpi
      )
    );

    // Optional: API call
    AddKPIsettings(
      {
        kpiCode: selectedKpi.kpi_code,
        colorScheme: selectedKpi.cs,
        targetValue: selectedKpi.value,
      },
      handlekpisuccess,
      handlekpierror
    );

    setSettingsOpen(false);
  };


  const handlekpisuccess = (dataObject) => {
    // loadDashboard();
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      closeSettings();
    }, 2000);
  };

  const handlekpierror = () => { };

  // const closeSettings = () => {
  //   setSettingsOpen(false);
  // };

  const updateScheme = (label, scheme) => {
    setKpiSettings((prev) => ({
      ...prev,
      [label]: scheme,
    }));
  };

  // -----------------------
  // API CALL
  // -----------------------

  // useEffect(() => {
  //   if (graphOpen) {
  //     setLoading(true);

  //     KPIGrapgDashboardApi(
  //       (res) => {
  //         setKpiConfig(res?.config || []);
  //         setKpiData(res?.data || []);
  //         setLoading(false);
  //       },
  //       () => setLoading(false)
  //     );
  //   }
  // }, [graphOpen]);

  const loadDashboard = useCallback(() => {
    setLoading(true);

    DashboardApi(
      (response) => {
        console.log("RESPONSE 👉", response);

        const jobCard = response?.data?.planning?.jobCard;

        const preventiveMaintenance =
          response?.data?.maintenance?.preventiveMaintenance;
        const powerConsumption = response?.data?.maintenance?.powerConsumption;
        const dieselGenerator = response?.data?.maintenance?.dieselGenerator;
        const breakdown = response?.data?.maintenance?.breakdown;

        const inwardPPM = response?.data?.quality?.inwardPPM;
        const inprocessRejPPM = response?.data?.quality?.inprocessRejPPM;
        const inprocessRewPPM = response?.data?.quality?.inprocessRewPPM;
        const finalPPM = response?.data?.quality?.finalPPM;

        const purchaseCost = response?.data?.purchase?.purchaseCost;
        const forecastAccuracy = response?.data?.purchase?.forecastAccuracy;
        const poAccuracy = response?.data?.purchase?.poAccuracy;

        const inventoryLevel = response?.data?.store?.inventoryLevel;
        const inventoryTurns = response?.data?.store?.inventoryTurns;
        const inventoryStockAge = response?.data?.store?.inventoryStockAge;
        const inwardDiscrepancy = response?.data?.store?.inwardDiscrepancy;

        const cancelledInvoice = response?.data?.account?.cancelledInvoice;
        const pendingPo = response?.data?.account?.pendingPo;
        const creditNote = response?.data?.account?.creditNote;
        const cutomerDc = response?.data?.account?.cutomerDc;

        const planVsProduction = response?.data?.production?.planVsProd;
        const capacityUtilization =
          response?.data?.production?.capacityUtilization;
        const OEE = response?.data?.production?.oee;
        const Efficiency = response?.data?.production?.machineEfficiency;

        const dailyOtd = response?.data?.dispatch?.dailyOtd;
        const timeAnalysis = response?.data?.dispatch?.timeAnalysis;

        // const cutomerDc = response?.data?.production?.cutomerDc;

        setPlanningValue(Number(jobCard?.value ?? 0));
        setPlanningTarget(Number(jobCard?.target ?? 0));
        setPlanningColour(jobCard?.cs);
        setPreventiveMaintenanceValue(
          Number(preventiveMaintenance?.value ?? 0)
        );
        setPreventiveMaintenanceTarget(
          Number(preventiveMaintenance?.target ?? 0)
        );
        setPreventiveMaintenanceColour(preventiveMaintenance?.cs);
        setPowerConsumptionValue(Number(powerConsumption?.value ?? 0));
        setPowerConsumptionTarget(Number(powerConsumption?.target ?? 0));
        setPowerConsumptionColour(powerConsumption?.cs);
        setDieselGeneratorValue(Number(dieselGenerator?.value ?? 0));
        setDieselGeneratorTarget(Number(dieselGenerator?.target ?? 0));
        setDieselGeneratorColour(dieselGenerator?.cs);
        setBreakDownValue(Number(breakdown?.value ?? 0));
        setBreakDownTarget(Number(breakdown?.target ?? 0));
        setBreakDownColour(breakdown?.cs);

        setInwardPPMValue(Number(inwardPPM?.value ?? 0));
        setInwardPPMTarget(Number(inwardPPM?.target ?? 0));
        setInwardPPMColour(inwardPPM?.cs);

        setInprocessRejPPMValue(Number(inprocessRejPPM?.value ?? 0));
        setInprocessRejPPMTarget(Number(inprocessRejPPM?.target ?? 0));
        setInprocessRejPPMColour(inprocessRejPPM?.cs);
        setInprocessRewPPMValue(Number(inprocessRewPPM?.value ?? 0));
        setInprocessRewPPMTarget(Number(inprocessRewPPM?.target ?? 0));
        setInprocessRewPPMColour(inprocessRewPPM?.cs);
        setFinalPPMValue(Number(finalPPM?.value ?? 0));
        setFinalPPMTarget(Number(finalPPM?.target ?? 0));
        setFinalPPMColour(finalPPM?.cs);
        setPurchaseCostValue(Number(purchaseCost?.value ?? 0));
        setPurchaseCostTarget(Number(purchaseCost?.target ?? 0));
        setPurchaseCostColour(purchaseCost?.cs);
        setForecastAccuracyValue(Number(forecastAccuracy?.value ?? 0));
        setForecastAccuracyTarget(Number(forecastAccuracy?.target ?? 0));
        setForecastAccuracyColour(forecastAccuracy?.cs);
        setPoAccuracyValue(Number(poAccuracy?.value ?? 0));
        setPoAccuracyTarget(Number(poAccuracy?.target ?? 0));
        setPoAccuracyColour(poAccuracy?.cs);
        setInventoryLevelValue(Number(inventoryLevel?.value ?? 0));
        setInventoryLevelTarget(Number(inventoryLevel?.target ?? 0));
        setInventoryLevelColour(inventoryLevel?.cs);
        setInventoryTurnsValue(Number(inventoryTurns?.value ?? 0));
        setInventoryTurnsTarget(Number(inventoryTurns?.target ?? 0));
        setInventoryTurnsColour(inventoryTurns?.cs);
        setInventoryStockAgeValue(Number(inventoryStockAge?.value ?? 0));
        setInventoryStockAgeTarget(Number(inventoryStockAge?.target ?? 0));
        setInventoryStockAgeColour(inventoryStockAge?.cs);
        setInwardDiscrepancyValue(Number(inwardDiscrepancy?.value ?? 0));
        setInwardDiscrepancyTarget(Number(inwardDiscrepancy?.target ?? 0));
        setInwardDiscrepancyColour(inwardDiscrepancy?.cs);
        setCancelledInvoiceValue(Number(cancelledInvoice?.value ?? 0));
        setCancelledInvoiceTarget(Number(cancelledInvoice?.target ?? 0));
        setCancelledInvoiceColour(cancelledInvoice?.cs);
        setPendingPoValue(Number(pendingPo?.value ?? 0));
        setPendingPoTarget(Number(pendingPo?.target ?? 0));
        setPendingPoColour(pendingPo?.cs);
        setCreditNoteValue(Number(creditNote?.value ?? 0));
        setCreditNoteTarget(Number(creditNote?.target ?? 0));
        setCreditNoteColour(creditNote?.cs);
        setCutomerDcValue(Number(cutomerDc?.value ?? 0));
        setCutomerDcTarget(Number(cutomerDc?.target ?? 0));
        setCutomerDcColour(cutomerDc?.cs);
        setPlanVsProductionValue(Number(planVsProduction?.value ?? 0));
        setPlanVsProductionTarget(Number(planVsProduction?.target ?? 0));
        setPlanVsProductionColour(planVsProduction?.cs);
        setCapacityUtilizationValue(Number(capacityUtilization?.value ?? 0));
        setCapacityUtilizationTarget(Number(capacityUtilization?.target ?? 0));
        setCapacityUtilizationColour(capacityUtilization?.cs);
        setOEEValue(Number(OEE?.value ?? 0));
        setOEETarget(Number(OEE?.target ?? 0));
        setOEEColour(OEE?.cs);
        setMachineEfficiencyValue(Number(Efficiency?.value ?? 0));
        setMachineEfficiencyTarget(Number(Efficiency?.target ?? 0));
        setMachineEfficiencyColour(Efficiency?.cs);
        setOTDRateValue(Number(dailyOtd?.value ?? 0));
        setOTDRateTarget(Number(dailyOtd?.target ?? 0));
        setOTDRateColour(dailyOtd?.cs);
        setVechileCountValue(Number(timeAnalysis?.value ?? 0));
        setVechileCountTarget(Number(timeAnalysis?.target ?? 0));
        setVechileCountColour(timeAnalysis?.cs);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handledispatcherror = () => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const DashboardSkeleton = () => {
    return (
      <Grid container spacing={2} sx={{ p: 2 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "16px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                borderTop: "4px solid #e0e0e0",
                p: 2,
              }}
            >
              <CardContent sx={{ p: 0 }}>
                {/* HEADER (ICON + TITLE) */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{ mb: 1.5 }}
                >
                  {/* Avatar Skeleton */}
                  <Skeleton variant="circular" width={34} height={34} />

                  {/* Title Skeleton */}
                  <Skeleton variant="text" width={120} height={28} />
                </Stack>

                {/* HEADER TEXT (Actual / Target) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box sx={{ flex: 1.8 }} />
                  <Box sx={{ flex: 1.2 }} />

                  <Skeleton variant="text" width={42} height={16} />

                  <Skeleton
                    variant="text"
                    width={42}
                    height={16}
                    sx={{ ml: 1 }}
                  />
                </Box>

                {/* KPI ROWS */}
                {[1, 2, 3].map((kpi) => (
                  <Box
                    key={kpi}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    {/* KPI Label */}
                    <Skeleton variant="text" width="45%" height={20} />

                    <Box sx={{ flex: 1 }} />

                    {/* Actual */}
                    <Skeleton variant="text" width={32} height={20} />

                    {/* Target */}
                    <Skeleton
                      variant="text"
                      width={32}
                      height={20}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // -----------------------
  // DASHBOARD SECTIONS
  // -----------------------
  const sections = useMemo(
    () => [
      {
        title: "Production",
        icon: <PrecisionManufacturingIcon />,
        data: [
          {
            label: "Plan Vs Production",
            actual: planVsProductionTarget,
            result: planVsProductionvalue,
            colorScheme: planVsProductionColour,
          },
          {
            label: "OEE",
            actual: OEETarget,
            result: OEEvalue,
            colorScheme: OEEColour,
          },
          {
            label: "Capacity Utilisation",
            actual: capacityUtilizationTarget,
            result: capacityUtilizationvalue,
            colorScheme: capacityUtilizationColour,
          },
          {
            label: "Machine Efficiency",
            actual: machineEfficiencyTarget,
            result: machineEfficiencyvalue,
            colorScheme: machineEfficiencyColour,
          },
        ],
      },

      {
        title: "Quality",
        icon: <FactCheckIcon />,
        data: [
          {
            label: "Inward PPM & Rejection Analysis",
            actual: inwardPPMTarget,
            result: inwardPPMvalue,
            colorScheme: inwardPPMColour,
          },
          {
            label: "Inprocess PPM & Rejections Analysis",
            actual: inprocessRejPPMTarget,
            result: inprocessRejPPMvalue,
            colorScheme: inprocessRejPPMColour,
          },
          {
            label: "Inprocess PPM & Rework Analysis",
            actual: inprocessRewPPMTarget,
            result: inprocessRewPPMvalue,
            colorScheme: inprocessRewPPMColour,
          },
          {
            label: "Final PPM & Rejection Analysis",
            actual: finalPPMTarget,
            result: finalPPMvalue,
            colorScheme: finalPPMColour,
          },
        ],
      },

      {
        title: "Maintenance",
        icon: <BuildIcon />,
        data: [
          {
            label: "Preventive Maintenance",
            actual: preventiveMaintenanceTarget,
            result: preventiveMaintenanceValue,
            colorScheme: preventiveMaintenanceColour,
          },
          {
            label: "Breakdown",
            actual: breakDownTarget,
            result: breakDownValue,
            colorScheme: breakDownColour,
          },
          {
            label: "Power Consumption",
            actual: powerConsumptionTarget,
            result: powerConsumptionValue,
            colorScheme: powerConsumptionColour,
          },
          {
            label: "Diesel Power Consumption",
            actual: dieselGeneratorTarget,
            result: dieselGeneratorValue,
            colorScheme: dieselGeneratorColour,
          },
        ],
      },

      {
        title: "Accounts",
        icon: <AccountBalanceIcon />,
        data: [
          {
            label: "Cancelled Invoice Analysis",
            actual: cancelledInvoiceTarget,
            result: cancelledInvoicevalue,
            colorScheme: cancelledInvoiceColour,
          },
          {
            label: "Credit Note Analysis",
            actual: creditNoteTarget,
            result: creditNotevalue,
            colorScheme: creditNoteColour,
          },
          {
            label: "Customer DC Analysis",
            actual: cutomerDcTarget,
            result: cutomerDcvalue,
            colorScheme: cutomerDcColour,
          },
          {
            label: "Pending PO Analysis",
            actual: pendingPoTarget,
            result: pendingPovalue,
            colorScheme: pendingPoColour,
          },
        ],
      },

      {
        title: "Purchase",
        icon: <ShoppingCartIcon />,
        data: [
          {
            label: "Forecast Accuracy",
            actual: forecastAccuracyTarget,
            result: forecastAccuracyvalue,
            colorScheme: forecastAccuracyColour,
          },
          {
            label: "PO Accuracy",
            actual: poAccuracyTarget,
            result: poAccuracyvalue,
            colorScheme: poAccuracyColour,
          },
          {
            label: "Purchase Cost",
            actual: purchaseCostTarget,
            result: purchaseCostvalue,
            colorScheme: purchaseCostColour,
          },
        ],
      },

      {
        title: "Store",
        icon: <StoreIcon />,
        data: [
          {
            label: "Inventory Stock Age Monitoring",
            actual: inventoryStockAgeTarget,
            result: inventoryStockAgevalue,
            colorScheme: inventoryStockAgeColour,
          },
          {
            label: "Inventory Level",
            actual: inventoryLevelTarget,
            result: inventoryLevelvalue,
            colorScheme: inventoryLevelColour,
          },
          {
            label: "Inventory Turns",
            actual: inventoryTurnsTarget,
            result: inventoryTurnsvalue,
            colorScheme: inventoryTurnsColour,
          },
          {
            label: "Inward Discrepancy",
            actual: inwardDiscrepancyTarget,
            result: inwardDiscrepancyvalue,
            colorScheme: inwardDiscrepancyColour,
          },
        ],
      },

      {
        title: "Dispatch",
        icon: <LocalShippingIcon />,
        data: [
          {
            label: "Customer Wise OTD Rate",
            actual: OTDRateTarget,
            result: OTDRateValue,
            colorScheme: OTDRateColour,
          },
          {
            label: "Vehicle Loading Time Analysis",
            actual: vechileCountTarget,
            result: vechileCountValue,
            colorScheme: vechileCountColour,
          },
        ],
      },

      {
        title: "Planning",
        icon: <CalendarMonthIcon />,
        data: [
          {
            label: "No of Job Card Review Analysis",
            actual: planningTarget,
            result: planningValue,
            colorScheme: planningColour,
          },
        ],
      },

      {
        title: "NPD & Tool",
        icon: <ConstructionIcon />,
        data: [
          { label: "Tool Preventive Maintenance", actual: 45, result: 100 },
          { label: "Tool maintenance Cost", actual: 55, result: 100 },
          { label: "Tool Life Monitoring", actual: 60, result: 100 },
          { label: "Average Tool Breakdown Time", actual: 38, result: 100 },
        ],
      },
    ],
    [
      planVsProductionvalue,
      planVsProductionTarget,
      planVsProductionColour,
      OEEvalue,
      OEETarget,
      OEEColour,
      capacityUtilizationvalue,
      capacityUtilizationTarget,
      capacityUtilizationColour,
      machineEfficiencyvalue,
      machineEfficiencyTarget,
      machineEfficiencyColour,

      inwardPPMvalue,
      inwardPPMTarget,
      inwardPPMColour,
      inprocessRejPPMvalue,
      inprocessRejPPMTarget,
      inprocessRejPPMColour,
      inprocessRewPPMvalue,
      inprocessRewPPMTarget,
      inprocessRewPPMColour,
      finalPPMvalue,
      finalPPMTarget,
      finalPPMColour,

      preventiveMaintenanceValue,
      preventiveMaintenanceTarget,
      preventiveMaintenanceColour,
      breakDownValue,
      breakDownTarget,
      breakDownColour,
      powerConsumptionValue,
      powerConsumptionTarget,
      powerConsumptionColour,
      dieselGeneratorValue,
      dieselGeneratorTarget,
      dieselGeneratorColour,

      cancelledInvoicevalue,
      cancelledInvoiceTarget,
      cancelledInvoiceColour,
      creditNotevalue,
      creditNoteTarget,
      creditNoteColour,
      cutomerDcvalue,
      cutomerDcTarget,
      cutomerDcColour,
      pendingPovalue,
      pendingPoTarget,
      pendingPoColour,

      forecastAccuracyvalue,
      forecastAccuracyTarget,
      forecastAccuracyColour,
      poAccuracyvalue,
      poAccuracyTarget,
      poAccuracyColour,
      purchaseCostvalue,
      purchaseCostTarget,
      purchaseCostColour,

      inventoryStockAgevalue,
      inventoryStockAgeTarget,
      inventoryStockAgeColour,
      inventoryLevelvalue,
      inventoryLevelTarget,
      inventoryLevelColour,
      inventoryTurnsvalue,
      inventoryTurnsTarget,
      inventoryTurnsColour,
      inwardDiscrepancyvalue,
      inwardDiscrepancyTarget,
      inwardDiscrepancyColour,

      OTDRateValue,
      OTDRateTarget,
      OTDRateColour,
      vechileCountValue,
      vechileCountTarget,
      vechileCountColour,

      planningValue,
      planningTarget,
      planningColour,
    ]
  );

  // -----------------------
  // LOADING & ERROR UI
  // -----------------------
  // 1️⃣ Loading State
  if (loading) {
    return <DashboardSkeleton />;
  }

  // 2️⃣ Error State
  if (error) {
    return (
      <Typography sx={{ p: 3, color: "error.main", fontWeight: 600 }}>
        {error}
      </Typography>
    );
  }

  // -----------------------
  // RENDER
  // -----------------------
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {sections.map((section, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            onClick={() => openGraphDialog(section)}
            sx={{
              height: "100%",
              borderRadius: "16px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              borderTop: `4px solid ${PRIMARY}`,
              p: 2,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* CARD HEADER */}
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Avatar sx={{ bgcolor: PRIMARY, width: 34, height: 34 }}>
                  {section.icon}
                </Avatar>

                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: PRIMARY,
                  }}
                >
                  {section.title}
                </Typography>

                {/* <IconButton size="small" 
                 onClick={(e) => openSettings(section, e)}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton> */}
              </Stack>

              {/* HEADER TEXT (Result / Actual) */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Box sx={{ flex: 1.8 }} />
                <Box sx={{ flex: 1.2 }} />

                <Typography
                  sx={{
                    minWidth: 42,
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#666",
                  }}
                >
                  Actual
                </Typography>

                <Typography
                  sx={{
                    minWidth: 42,
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#666",
                  }}
                >
                  Target
                </Typography>
              </Box>

              {/* KPI LIST */}
              {section.data.map((item, idx) => (
                <KPIItem
                  key={idx}
                  label={item.label}
                  result={item.result}
                  actual={item.actual}
                  colorScheme={
                    kpiSettings[item.label] ?? item.colorScheme ?? "Normal"
                  }
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}

      <Dialog
        open={settingsOpen}
        onClose={closeSettings}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>KPI Configuration</DialogTitle>

        <Divider />

        <DialogContent sx={{ mt: 2 }}>
          {selectedKpi && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* KPI Name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  KPI Name
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  {selectedKpi.label}
                </Typography>
              </Box>

              {/* Color Scheme */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Color Scheme
                </Typography>

                <Select
                  size="small"
                  sx={{ minWidth: 140 }}
                  value={selectedKpi?.cs}
                  onChange={(e) =>
                    setSelectedKpi((prev) => ({
                      ...prev,
                      cs: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Reverse">Reverse</MenuItem>
                </Select>
              </Box>

              {/* Target Value */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Set Target Value
                </Typography>

                <TextField
                  size="small"
                  type="number"
                  sx={{ width: 140 }}
                  placeholder="Eg: 85"
                  value={selectedKpi.value}
                  onChange={(e) =>
                    setSelectedKpi((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  inputProps={{ min: 0, max: 100 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        <Divider />

        {/* Action Buttons */}
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={closeSettings}>
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={graphOpen}
        onClose={closeGraphDialog}
        fullWidth
        maxWidth={false}
        PaperProps={{ sx: { width: "95vw", height: "90vh" } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>
          KPI Trends
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            {kpiConfig.map((kpi) => (
              <Grid item xs={12} sm={6} md={4} key={kpi.key}>
                <KPIChartCard
                  kpi={kpi}
                  apiData={kpiData}
                  onOpenSettings={openKpiSettings}
                  onViewGraph={handleViewGraph}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={closeGraphDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Grid>
  );
};

export default MasterDashboard;
