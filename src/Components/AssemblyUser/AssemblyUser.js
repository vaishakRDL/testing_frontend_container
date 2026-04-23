import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import AssemblyPlanning from './AssemblyPlanning';
import DispatchResult from '../Dispatch/DispatchResult';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useState } from 'react';
import AssemblyPlanning from '../MachinePlaning/AssemblyPlanning';
import AssemblyUserPlanning from './AssemblyUserPlanning';
import ShipmentPlanningResult from './Dispatch/ShipmentPlanningResult';
import DownTime from './DownTime';

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
                <Box sx={{ p: 1 }}>
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

const AssemblyUser = () => {

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const [value, setValue] = React.useState(userDetails.userRole === "Assembly" ? 1 : 0);

    const machinePermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "MachinePlanning");
    const AssemblyPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "AssemblyPlanning");
    const ShipmentPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "ShipmentPlanning");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={AssemblyPermission[0]?.viewData === 1 ? 0 : ShipmentPermission[0]?.viewData === 1 ? 1 : value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Assembly Planning" {...a11yProps(0)} disabled={AssemblyPermission[0]?.viewData === 1} />
                    <Tab label="Shipment Planning" {...a11yProps(1)} disabled={ShipmentPermission[0]?.viewData === 1} />
                    <Tab label="Downtime" {...a11yProps(2)} disabled={ShipmentPermission[0]?.viewData === 1} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AssemblyUserPlanning />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ShipmentPlanningResult />
            </CustomTabPanel>   
            <CustomTabPanel value={value} index={2}>
                <DownTime />
            </CustomTabPanel>   
          
        </Box>
    );
}
export default AssemblyUser;

