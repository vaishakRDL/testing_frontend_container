import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';

const FimInsideTitle = (props) => {
    const [file, setFile] = useState(null);

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    const goBack = () => {
        // Navigate to the previous page
        props.setIsFpiReport(false);
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                     sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold', color: '#0769d9', '&:hover': { color: '#043f82' } }}
                        variant="h5"
                    onClick={goBack}
                >
                    {'Report >>'}
                </Typography>
                <Typography sx={{ m: 1 }} variant="h5">
                    {`${props?.reportType} Report`}
                </Typography>
            </Box>
            
        </Box>
    );
}

export default FimInsideTitle;
