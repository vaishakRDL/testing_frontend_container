import React, { useEffect, useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AddChecklistResult from "../Checklist/AddChecklistResult";
import ChecklistReport from "../ChecklistReport/ChecklistReport";
import ChecklistTemplateResult from "../ChecklistTemplate/ChecklistTemplateResult";
// import { ROOT_CYCLE } from "../Cycle";
// import FaultMetric from './MaintenanceReport/FaultMetric'
// import WeldingWire from "./ReportTabPages/WeldingWireKg/WeldingWire";

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
                <Box sx={{ p: 3 }}>
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

const Checklist = () => {
    const [value, setValue] = React.useState(0);
    const [permissions, setPermissions] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        setPermissions(userDetails?.userDetails?.accessibleModules)
        console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", userDetails?.userDetails?.accessibleModules)
    }, [])

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: { xs: 320, sm: '100%' }, display: 'flex', justifyContent: 'center' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    indicatorColor="primary"
                    sx={{
                        '.MuiTabs-indicator': {
                            backgroundColor: '#DC3545', // Tab line color (e.g., red)
                        },
                    }}
                >
                    <Tab label="CHECKLIST" {...a11yProps(0)}
                        sx={{
                            color: '#000000', // Inactive tab color (e.g., black)
                            fontWeight: 'bold',
                            '&.Mui-selected': {
                                color: '#DC3545', // Active tab color (e.g., red)
                            },
                        }}
                    />
                    {/* )} */}

                    {/* {permissions.includes("Oee") && ( */}
                    <Tab label="CHECKLIST TEMPLATE" {...a11yProps(1)}
                        sx={{
                            color: '#000000', // Inactive tab color (e.g., black)
                            fontWeight: 'bold',
                            '&.Mui-selected': {
                                color: '#DC3545', // Active tab color (e.g., red)
                            },
                        }}
                    />
                    {/* )} */}

                    {/* {permissions.includes("Production") && ( */}
                    <Tab label="CHECKLIST REPORT" {...a11yProps(2)}
                        sx={{
                            color: '#000000', // Inactive tab color (e.g., black)
                            fontWeight: 'bold',
                            '&.Mui-selected': {
                                color: '#DC3545', // Active tab color (e.g., red)
                            },
                        }}
                    />

                </Tabs>



            </Box>
            <CustomTabPanel value={value} index={0}>
                <AddChecklistResult />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ChecklistTemplateResult />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <ChecklistReport />
            </CustomTabPanel>
        </Box>
    );
}
export default Checklist;