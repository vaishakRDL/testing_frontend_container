import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import QOPCList from "../QOPCMaster/QOPCList";
import MaterialRateResult from "../MaterialRateMaster/MaterialRateResult";
import ReworkManHourResult from "../ReworkManHourMaster/ReworkManHourResult";
import DescriptionTabList from "../Description Master/DescriptionTabList";
import PriceMapList from "../PriceMapMaster/PriceMapList";


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
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
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
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const RateMasterTablist = () => {
    const [value, setValue] = React.useState(0); // 🔥 No condition, always start from first tab

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Material Rate" {...a11yProps(0)} />
                    {/* <Tab label="Process Map" {...a11yProps(1)} /> */}
                    <Tab label="Process Price Map" {...a11yProps(1)} />
                    <Tab label="Rework Man Hour Rate" {...a11yProps(2)} />
                    <Tab label="Description" {...a11yProps(3)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <MaterialRateResult />
            </CustomTabPanel>

            {/* <CustomTabPanel value={value} index={1}>
                <QOPCList />
            </CustomTabPanel> */}

            <CustomTabPanel value={value} index={1}>
                <PriceMapList />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
                <ReworkManHourResult />
            </CustomTabPanel>

            <CustomTabPanel value={value} index={3}>
                <DescriptionTabList />
            </CustomTabPanel>
        </Box>
    );
};

export default RateMasterTablist;
