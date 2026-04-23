// import React, { useState } from 'react';
// import { Box, Button, Grid, Typography } from '@mui/material';
// import Stack from '@mui/material/Stack';
// import Fab from '@mui/material/Fab';
// import AddIcon from '@mui/icons-material/Add';

// const FPIReportTitle = (props) => {
//     const [file, setFile] = useState(null);

//     const handleFileUpload = () => {
//         // Handle the uploaded file here
//     };

//     return (
//         <Box
//             sx={{
//                 mb: '10px',
//                 alignItems: 'center',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 flexWrap: 'wrap',
//                 marginLeft: '10px',
//                 marginRight: '10px'
//             }}
//         >
//             <Typography
//                 sx={{ m: 1, fontFamily: 'Roboto Slab'  }}
//                 variant="h5"
//             >
//                FPI Report
//             </Typography>

//             <Box
//                 sx={{ m: 1 }}

//             >
//                 <Grid container alignItems={'center'} spacing={2}>



//                 </Grid>
//             </Box>
//         </Box>
//     )
// }
// export default FPIReportTitle;

// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Grid from '@mui/material/Grid';
// import { Link } from 'react-router-dom';
// const FPIReportTitle = () => {
//   const [value, setValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   function a11yProps(index) {
//       return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//       };
//     }

//   return (
//     <Box
//       sx={{
//         mb: '10px',
//         alignItems: 'center',
//         display: 'flex',
//         justifyContent: 'space-between',
//         flexWrap: 'wrap',
//         marginLeft: '10px',
//         marginRight: '10px',
//       }}
//     >
//         <Box>
//       <Tabs value={value} onChange={handleChange}>
//       <Tab label="FPI Report" {...a11yProps(0)} />
//            <Tab label="Observation Report" {...a11yProps(1)} />
//         <Tab label="LPI Report" {...a11yProps(2)} />
//           <Tab label="Rework Report" {...a11yProps(3)} />
//       </Tabs>
//       </Box>
//       <CustomTabPanel value={value} index={0}>
//          <FPIReport />
//        </CustomTabPanel>
//       <CustomTabPanel value={value} index={1}>
//        <ObservationReport />
//        </CustomTabPanel>
//       <CustomTabPanel value={value} index={2}>
//         <LPIReport />
//       </CustomTabPanel>
//        <CustomTabPanel value={value} index={3}>
//          <ReworkReport />
//       </CustomTabPanel>
//     </Box>
//   );
// };

// export default FPIReportTitle;

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FPIReport from './FPIReport';
import ObservationReport from '../ObservationReport/ObservationReport';
import LPIReport from '../LPIReport/LPIReport';
import ReworkReport from '../ReworkReport/ReworkReport';
import { useState } from 'react';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function FPIReportTitle() {
  const [value, setValue] = React.useState(0);
  const [reportType, setReportType] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="FPI Report" {...a11yProps(0)} />
          <Tab label="Observation Report" {...a11yProps(1)} />
          <Tab label="LPI Report" {...a11yProps(2)} />
          <Tab label="Rework Report" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <FPIReport
          reportType='FPI'
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* <ObservationReport /> */}
        <FPIReport
          reportType='Observation'
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {/* <LPIReport /> */}
        <FPIReport
          reportType='LPI'
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {/* <ReworkReport /> */}
        <FPIReport
          reportType='Rework'
        />
      </CustomTabPanel>
    </Box>
  );
}