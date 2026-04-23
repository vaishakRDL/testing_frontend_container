import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

const EinvoicingTools = (props) => {
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
                // marginLeft: '10px',
                // marginRight: '10px'
                marginBottom: '25px',
                marginTop: '25px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab' }}
                variant="h5"
            >
               E-Invoicing
            </Typography>

            <Box
                sx={{ m: 1 }}

            >
                <Grid container alignItems={'center'} spacing={2}>

                </Grid>
            </Box>
        </Box>
    )
}

export default EinvoicingTools