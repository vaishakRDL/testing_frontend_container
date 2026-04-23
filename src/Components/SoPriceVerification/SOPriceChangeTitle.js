import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

const SOPriceChangeTitle = () => {
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
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                SO Price Verification
            </Typography>
            <Box
                sx={{ m: 1 }}
            >

            </Box>

        </Box>
    )
}

export default SOPriceChangeTitle
