import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
// import MaintenanceSchedule from './MaintenanceSchedule';
// import WarrantyDues from './WarrantyDues';
// import AMCDues from './AMCDues';
// import CertificationDues from './CertificationDues';
// import WarrentyDueList from '../Warrenty/WarrentyDueList';
// import AmcServiceDue from '../AMC/AmcService/AmcServiceDue';
// import CertificateDue from '../CertificateAmc/CertificateDue';
// import { CertificateDueView, ServiceDueView, Warrentyview } from '../../../../Services/NodeJsApiServices';
import MaintenanceSchedule from './MaintenanceSchedule';
// import WarrentyDueList from '../../../AMC/Warrenty/WarrentyDueList';
// import AmcServiceDue from '../../../AMC/AmcService/AmcServiceDue';
// import CertificateDue from '../../../AMC/CertificateAmc/CertificateDue';
// import { CertificateDueView, ServiceDueView, Warrentyview } from '../../../services/LoginServiceNod';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const MaintenanceHeaderCard = () => {
    const [cardClick, setCardClick] = useState('0');
    const [count, setCount] = useState("");
    const [wcount, setwCount] = useState("");
    const [amcount, setamCount] = useState("");
    const [certcount, setcertCount] = useState("");
    const [maintopen, setmaintopen] = useState(false);
    const [rows, setRows] = useState([]);
    const [warrantyDueListRendered, setWarrantyDueListRendered] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [department, setDepartment] = useState('');
    const [section, setSection] = useState('');
    const [assetType, setAssetType] = useState('');

    const [Arows, setARows] = useState([]);
    const [Crows, setCRows] = useState([]);


    useEffect(() => {
        // Warrentyview({ fromDate, toDate }, handleDepartmentshow, handleDepartmentshowException);
        // ServiceDueView({
        //     fromDate: fromDate,
        //     toDate: toDate,
        //     Department: department,
        //     Section: section,
        //     AssetType: assetType,
        // }, handleServiceDueView2, handleServiceDueViewException2)
        // CertificateDueView({
        //     fromDate: fromDate,
        //     toDate: toDate,
        //     Department: department,
        //     Section: section,
        //     AssetType: assetType,
        // }, handleServiceDueView3, handleServiceDueViewException3)
    }, [maintopen])

    const handleDepartmentshow = (dataObject) => {
        const data = dataObject.data || [];
        setRows(dataObject?.data);
        const count = data.length; // Count the data
        console.log("length==", count); // Log the count here
        setwCount(count); // Set the count state if needed elsewhere in the component
        // console.log(dataObject?.data);
    }

    const handleDepartmentshowException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    const handleServiceDueView2 = (dataObject) => {
        const data = dataObject.data || [];
        setARows(dataObject.data);
        const count = data.length; // Count the data
        console.log("length==", count); // Log the count here
        setamCount(count);
    }

    const handleServiceDueViewException2 = (errorStaus, errorMessage) => {
        console.log(errorMessage);
        // setNotification({
        //   status: true,
        //   type: 'error',
        //   message: errorMessage,
        // });
    }




    const handleServiceDueView3 = (dataObject) => {
        const data = dataObject.data || [];
        setCRows(dataObject.data);

        const count = data.length; // Count the data
        console.log("length==", count); // Log the count here
        setcertCount(count);
    }

    const handleServiceDueViewException3 = (errorStaus, errorMessage) => {
        console.log(errorMessage);
        // setNotification({
        //   status: true,
        //   type: 'error',
        //   message: errorMessage,
        // });
    }

    return (
        <Box margin={2}>
            {/* <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Item onClick={() => setCardClick('0')}>
                        <Grid container sx={{ height: 100 }} alignItems={'center'} justifyContent={'space-between'}>
                            <Grid item>
                                <Typography fontSize={17} fontWeight={'bold'} color={'#191250'}>MAINTENANCE SCHEDULE</Typography>
                                <Typography fontSize={25} fontWeight={'bold'} color={'#7C83F3'}>{count}</Typography>
                            </Grid>
                            <Grid item>
                                <BuildIcon sx={{ fontSize: 40, color: '#3a32e7' }} />
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Item onClick={() => setCardClick('1')}>
                        <Grid container sx={{ height: 100 }} alignItems={'center'} justifyContent={'space-between'}>
                            <Grid item>
                                <Typography fontSize={17} fontWeight={'bold'} color={'#191250'}>WARRANTY DUES</Typography>
                                <Typography fontSize={25} fontWeight={'bold'} color={'#7C83F3'}> {wcount ? wcount : 0}</Typography>
                            </Grid>
                            <Grid item>
                                <BuildIcon sx={{ fontSize: 40, color: '#3a32e7' }} />
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Item onClick={() => setCardClick('2')}>
                        <Grid container sx={{ height: 100 }} alignItems={'center'} justifyContent={'space-between'}>
                            <Grid item>
                                <Typography fontSize={17} fontWeight={'bold'} color={'#191250'}>AMC DUES</Typography>
                                <Typography fontSize={25} fontWeight={'bold'} color={'#7C83F3'}>{amcount ? amcount : 0}</Typography>
                            </Grid>
                            <Grid item>
                                <BuildIcon sx={{ fontSize: 40, color: '#3a32e7' }} />
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Item onClick={() => setCardClick('3')}>
                        <Grid container sx={{ height: 100 }} alignItems={'center'} justifyContent={'space-between'}>
                            <Grid item>
                                <Typography fontSize={17} fontWeight={'bold'} color={'#191250'}>CERTIFICATION DUES</Typography>
                                <Typography fontSize={25} fontWeight={'bold'} color={'#7C83F3'}>{certcount ? certcount : 0}</Typography>
                            </Grid>
                            <Grid item>
                                <BuildIcon sx={{ fontSize: 40, color: '#3a32e7' }} />
                            </Grid>
                        </Grid>
                    </Item>
                </Grid>
            </Grid> */}

            {cardClick === "0" && <MaintenanceSchedule count={count} maintopen={maintopen} setmaintopen={setmaintopen}
                setCount={setCount} />}
            {/* {cardClick === "1" && <WarrentyDueList wcount={wcount} maintopen={maintopen} rows={rows} setRows={setRows}
                setwCount={setwCount} />}
            {cardClick === "2" && <AmcServiceDue amcount={amcount} maintopen={maintopen} Arows={Arows} setARows={setARows}
                setamCount={setamCount} />}
            {cardClick === "3" && <CertificateDue certcount={certcount} maintopen={maintopen} Crows={Crows} setCRows={setCRows}
                setcertCount={setcertCount} />} */}

        </Box>
    )
}
export default MaintenanceHeaderCard;
