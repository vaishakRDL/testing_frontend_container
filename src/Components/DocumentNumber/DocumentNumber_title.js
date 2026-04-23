import { Box, Typography } from '@mui/material';
import React from 'react'

const DocumentNumber_title = () => {
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
        Document Number
    </Typography>
   
</Box>
  )
}

export default DocumentNumber_title