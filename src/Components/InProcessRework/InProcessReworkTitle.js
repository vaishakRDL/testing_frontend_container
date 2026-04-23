import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const InProcessReworkTitle = (props) => {
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
            <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>

                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold', color: '#0769d9', '&:hover': { color: '#043f82' } }}
                    variant="h5"
                    onClick={() => {
                        props.setIsProcessInsp(0);
                    }}
                >
                    {`Process Inspection>>`}
                </Typography>

                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    Rework Inspection
                </Typography>
            </div>
            {/* <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab'  }}
                variant="h5"
            >
               Rework Inspection
            </Typography> */}

            <Box
                sx={{ m: 1 }}

            >
                <Grid container alignItems={'center'} spacing={2}>


                </Grid>
            </Box>
        </Box>
    )
}
export default InProcessReworkTitle;