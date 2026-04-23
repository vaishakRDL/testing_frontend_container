import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

const ViewSfgVendorProcessTitle = (props) => {

    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px',
                marginTop: '12px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                View SFG Supplier Process
            </Typography>
        </Box>
    )
}

export default ViewSfgVendorProcessTitle