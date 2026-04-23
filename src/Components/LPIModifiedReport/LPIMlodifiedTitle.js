import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link, Link as RouterLink } from 'react-router-dom';


const LPIModifiedTitle = (props) => {
    const [file, setFile] = useState(null);

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px'
            }}
        >
            {/* <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab'  }}
                variant="h5"
            >
                LPI
            </Typography> */}
            <Link
                component={RouterLink}
                to="/FPIReportTitle"
                style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
                <Typography sx={{ m: 1 }} variant="h5">
                    {` LPI`}
                </Typography>
            </Link>
            

            <Box
                sx={{ m: 1 }}

            >
                <Grid container alignItems={'center'} spacing={2}>

                  

                </Grid>
            </Box>
        </Box>
    )
}
export default LPIModifiedTitle;