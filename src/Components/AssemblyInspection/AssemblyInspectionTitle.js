import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const AssemblyInspectionTitle = (props) => {
    const { contractRadioChange } = props;
    const [file, setFile] = useState(null);

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    return (
        <Box
            sx={{
                // mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                // marginLeft: '10px',
                marginRight: '10px'
            }}
        >
            <Typography
                sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                {contractRadioChange === 'contract' ? 'Contract Inspection' : 'Assembly Plan Inspection'}
            </Typography>

            <Box
                sx={{ m: 1 }}
                Process Inspection
            >
                <Grid container alignItems={'center'} spacing={2}>

                </Grid>
            </Box>
        </Box>
    )
}
export default AssemblyInspectionTitle;