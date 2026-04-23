import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PurchaseOrderGenerationTitle = (props) => {
    const [file, setFile] = useState(null);
    const location = useLocation();

    const isBOI = new URLSearchParams(location.search).get('isBOI');

    const handleFileUpload = () => {
    };

    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
            }}
        >
            {isBOI && <Link to='/RMBOIIndentReportResult' style={{ textDecoration: 'none' }}>
                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    {`RM/BOI Indent Report>>`}
                </Typography>
            </Link>}
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                New Purchase Order
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

export default PurchaseOrderGenerationTitle