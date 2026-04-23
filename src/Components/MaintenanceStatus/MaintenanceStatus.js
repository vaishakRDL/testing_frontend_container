// import * as React from 'react';
// import PropTypes from 'prop-types';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import { Grid } from '@mui/material';
// import Approved from './Approved';
// import Pending from './Pending';
// import Rejected from './Rejected';
// import Completed from './Completed';
// import MachineBreakdownTrend from './MachineBreakdownTrend';
// import MTBF_MonitoringTrend from './MTBF_MonitoringTrend';

// // import Approved from './Approved';
// // import Pending from './Pending';
// // import Rejected from './Rejected';
// // import Completed from './Completed';

// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 1 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }


// const MaintenanceStatus = () => {
//   const [value, setValue] = React.useState(0);
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   return (
//     <Grid container>
//       <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//         <Box >
//           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               aria-label="secondary tabs example"
//               variant="scrollable" // Make tabs scrollable
//               scrollButtons="auto" // Automatically show scroll buttons when needed
//               indicatorColor="primary"
//               sx={{
//                 '.MuiTabs-indicator': {
//                   backgroundColor: '#DC3545', // Tab line color (e.g., red)
//                 },
//               }}

//             >
//               <Tab label="APPROVED" {...a11yProps(0)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />
//               <Tab label="PENDING" {...a11yProps(1)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />
//               <Tab label="REJECTED" {...a11yProps(2)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />
//               <Tab label="Completed" {...a11yProps(3)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />
//               <Tab label="Machine Breakdown Trend" {...a11yProps(4)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />
//               <Tab label="Mean Time Between Failures" {...a11yProps(5)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />
//               {/* <Tab label="Mean Time Between Failures" {...a11yProps(6)}
//                 sx={{
//                   color: '#000000', // Inactive tab color (e.g., black)
//                   fontWeight: 'bold',
//                   '&.Mui-selected': {
//                     color: '#DC3545', // Active tab color (e.g., red)
//                   },
//                 }}
//               />       */}
//             </Tabs>
//           </Box>
//           <TabPanel value={value} index={0}>
//             <Approved index={value} />
//           </TabPanel>
//           <TabPanel value={value} index={1}>
//             <Pending />
//           </TabPanel>
//           <TabPanel value={value} index={2}>
//             <Rejected />
//           </TabPanel>
//           <TabPanel value={value} index={3}>
//             <Completed />
//           </TabPanel>
//           <TabPanel value={value} index={4}>
//             <MachineBreakdownTrend />
//           </TabPanel>
//           <TabPanel value={value} index={5}>
//             <MTBF_MonitoringTrend />
//           </TabPanel>
//           {/* <TabPanel value={value} index={6}>
//             <MTTR_Monitor />
//           </TabPanel> */}
//           {/* <TabPanel value={value} index={6}>
//             <MTTR_Monitor />
//           </TabPanel> */}
//           {/* <TabPanel value={value} index={6}>
//           <FaultMetric />
//           </TabPanel> */}
//         </Box>
//       </Grid>
//     </Grid>
//   )
// }

// export default MaintenanceStatus
// import React, { useState, useMemo, Suspense, lazy, useCallback } from "react";
// import PropTypes from "prop-types";
// import { Tabs, Tab, Box, Grid, CircularProgress } from "@mui/material";

// // 🔹 Lazy Load Components
// const Approved = lazy(() => import("./Approved"));
// const Pending = lazy(() => import("./Pending"));
// const Rejected = lazy(() => import("./Rejected"));
// const Completed = lazy(() => import("./Completed"));
// const MachineBreakdownTrend = lazy(() =>
//   import("./MachineBreakdownTrend")
// );
// const MTBF_MonitoringTrend = lazy(() =>
//   import("./MTBF_MonitoringTrend")
// );

// // 🔹 Tab Panel (Standard Conditional Rendering to fix DataGrid resize glitches)
// const TabPanel = ({ children, value, index }) => {
//   if (value !== index) return null;
//   return (
//     <div role="tabpanel">
//       <Box sx={{ p: 1 }}>{children}</Box>
//     </div>
//   );
// };

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   value: PropTypes.number,
//   index: PropTypes.number,
// };

// // 🔹 MAIN COMPONENT
// const MaintenanceStatus = () => {
//   const [value, setValue] = useState(0);

//   // ✅ Prevent unnecessary re-renders
//   const handleChange = useCallback((_, newValue) => {
//     setValue(newValue);
//   }, []);

//   // 🔹 Tabs Config (BEST PRACTICE)
//   const tabs = useMemo(
//     () => [
//       { label: "APPROVED", Component: Approved },
//       { label: "PENDING", Component: Pending },
//       { label: "REJECTED", Component: Rejected },
//       { label: "COMPLETED", Component: Completed },
//       { label: "Machine Breakdown Trend", Component: MachineBreakdownTrend },
//       { label: "Mean Time Between Failures", Component: MTBF_MonitoringTrend },
//     ],
//     []
//   );

//   // 🔹 Common Tab Style
//   const tabStyle = {
//     color: "#000",
//     fontWeight: 600,
//     textTransform: "none",
//     "&.Mui-selected": {
//       color: "#DC3545",
//     },
//   };

//   return (
//     <Grid container>
//       <Grid item xs={12}>
//         <Box>
//           {/* 🔷 Tabs Header */}
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{
//                 "& .MuiTabs-indicator": {
//                   backgroundColor: "#DC3545",
//                   height: 3,
//                 },
//               }}
//             >
//               {tabs.map((tab, index) => (
//                 <Tab key={index} label={tab.label} sx={tabStyle} />
//               ))}
//             </Tabs>
//           </Box>

//           {/* 🔷 Tab Content */}
//           <Suspense
//             fallback={
//               <Box textAlign="center" mt={3}>
//                 <CircularProgress size={28} />
//               </Box>
//             }
//           >
//             {tabs.map((tab, index) => {
//               const Component = tab.Component;

//               return (
//                 <TabPanel key={index} value={value} index={index}>
//                   <Component />
//                 </TabPanel>
//               );
//             })}
//           </Suspense>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default MaintenanceStatus;


import React, { useState, useMemo, Suspense, lazy, useCallback } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, Grid, CircularProgress } from "@mui/material";

// 🔹 Lazy Load Components
const Approved = lazy(() => import("./Approved"));
const Pending = lazy(() => import("./Pending"));
const Rejected = lazy(() => import("./Rejected"));
const Completed = lazy(() => import("./Completed"));
const MachineBreakdownTrend = lazy(() =>
  import("./MachineBreakdownTrend")
);
const MTBF_MonitoringTrend = lazy(() =>
  import("./MTBF_MonitoringTrend")
);

// 🔹 Tab Panel (only renders active tab)
const TabPanel = ({ children }) => {
  return (
    <div role="tabpanel">
      <Box sx={{ p: 1 }}>{children}</Box>
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
};

// 🔹 MAIN COMPONENT
const MaintenanceStatus = () => {
  const [value, setValue] = useState(0);

  // ✅ Prevent unnecessary re-renders
  const handleChange = useCallback((_, newValue) => {
    setValue(newValue);
  }, []);

  // 🔹 Tabs Config
  const tabs = useMemo(
    () => [
      { label: "APPROVED", Component: Approved },
      { label: "PENDING", Component: Pending },
      { label: "REJECTED", Component: Rejected },
      { label: "COMPLETED", Component: Completed },
      { label: "Machine Breakdown Trend", Component: MachineBreakdownTrend },
      { label: "Mean Time Between Failures", Component: MTBF_MonitoringTrend },
    ],
    []
  );

  // ✅ Only active component will render
  const ActiveComponent = tabs[value].Component;

  // 🔹 Common Tab Style
  const tabStyle = {
    color: "#000",
    fontWeight: 600,
    textTransform: "none",
    "&.Mui-selected": {
      color: "#DC3545",
    },
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box>
          {/* 🔷 Tabs Header */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#DC3545",
                  height: 3,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} sx={tabStyle} />
              ))}
            </Tabs>
          </Box>

          {/* 🔷 Tab Content (ONLY ACTIVE TAB) */}
          <Suspense
            fallback={
              <Box textAlign="center" mt={3}>
                <CircularProgress size={28} />
              </Box>
            }
          >
            <TabPanel>
              <ActiveComponent />
            </TabPanel>
          </Suspense>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MaintenanceStatus;