import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link, Link as RouterLink } from 'react-router-dom';


const LPIModifiedTitle = (props) => {
    const [file, setFile] = useState(null);

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    const [value, setValue] = useState(0);

  // Step 2: Update the state variable when the link is clicked
  const handleLinkClick = () => {
    setValue(1); // Set the tab index you want to navigate to
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
            <Link
        component={RouterLink}
        to="/FPIReportTitle"
        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        onClick={handleLinkClick}
      >
        <Typography sx={{ m: 1 }} variant="h5">
          {`Observation Report`}
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