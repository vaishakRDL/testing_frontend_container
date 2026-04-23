import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import QualityAssemblyReport from './QualityAssemblyReport';
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

export default function QualityAssemblyReportTitle() {
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
        <QualityAssemblyReport
          reportType='FPI'
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* <ObservationReport /> */}
        <QualityAssemblyReport
          reportType='Observation'
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {/* <LPIReport /> */}
        <QualityAssemblyReport
          reportType='LPI'
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {/* <ReworkReport /> */}
        <QualityAssemblyReport
          reportType='Rework'
        />
      </CustomTabPanel>
    </Box>
  );
}