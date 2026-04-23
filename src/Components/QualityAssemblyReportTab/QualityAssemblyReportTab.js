import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import QualityAssemblyReportTitle from '../QualityAssemblyReport/QualityAssemblyReportTitle';
import QualityFpiReportTitle from '../QualityFpiReport/QualityFpiReportTitle';
// import ProcessInspectionResult from '../ProcessInspection/ProcessInspectionResult';
// import AssemblyInspection from '../AssemblyInspection/AssemblyInspection';
// import SRNInspection from '../SRNInscpection/SRNInspection';

export default function QualityAssemblyReportTab() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Assembly" value="1" />
                        <Tab label="FIM" value="2" />
                        {/* <Tab label="SRN" value="3" /> */}
                    </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: 0 }}>
                    <QualityAssemblyReportTitle />
                </TabPanel>
                <TabPanel value="2" style={{ padding: 0 }}>
                    <QualityFpiReportTitle />
                </TabPanel>
            </TabContext>
        </Box>
    );
}