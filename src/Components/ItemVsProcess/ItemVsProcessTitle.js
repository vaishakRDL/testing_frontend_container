import { Box, Button, Grid, Typography } from '@mui/material';

const ItemVsProcessTitle = (props) => {

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
                marginTop: '8px',
                marginBottom: '8px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                Item Vs Process Allocation
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

export default ItemVsProcessTitle