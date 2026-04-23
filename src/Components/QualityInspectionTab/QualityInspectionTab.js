import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ProcessInspectionResult from '../ProcessInspection/ProcessInspectionResult';
import AssemblyInspection from '../AssemblyInspection/AssemblyInspection';
import SRNInspection from '../SRNInscpection/SRNInspection';
import AssemblyTab from '../AssemblyInspection/AssemblyTab/AssemblyTab';
import InwardInspectionResult from '../ProcessInspectionInward/InwardInspectionResult';
import QcApproval from '../QcApproval/QcApproval';
import { useLocation } from 'react-router-dom';

export default function QualityInspectionTab() {
    const location = useLocation();
    const tab = location.state?.tab || '1';

    const [value, setValue] = React.useState(tab);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" sx={{
                        marginTop: '-10px',
                        // marginLeft: '10px'
                    }}>
                        <Tab label="Production" value="1" />
                        <Tab label="Assembly" value="2" />
                        <Tab label="Inward" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: 0 }}>
                    <ProcessInspectionResult />
                </TabPanel>
                <TabPanel value="2" style={{ padding: 0 }}>
                    {/* <AssemblyInspection /> */}
                    <AssemblyTab />
                </TabPanel>
                <TabPanel value="3" style={{ padding: 0 }}>
                    {/* <InwardInspectionResult /> */}
                    <QcApproval />
                </TabPanel>
            </TabContext>
        </Box>
    );
}