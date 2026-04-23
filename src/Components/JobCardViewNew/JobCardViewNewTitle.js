import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';

const JobCardViewNewTitle = (props) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            <Typography
                sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                Job Card View
            </Typography>
        </Box>
    )
}

export default JobCardViewNewTitle