import React from 'react';
import { Box, Grid, Typography, Fab, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ChecklistTemplateTitle = (props) => {
    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                backgroundColor: '#ffffff',
                padding: '20px 24px',
                borderRadius: '12px 12px 0 0',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}
        >
            <Typography
                sx={{ 
                    m: 0, 
                    color: '#0f172a', 
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    fontSize: '1.5rem'
                }}
                variant="h5"
                component="h1"
            >
                Checklist Templates
            </Typography>
            <Box>
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack direction="row" spacing={2}>
                            <Fab
                                sx={{
                                    backgroundColor: "#002D68", 
                                    color: "#ffffff",
                                    px: 3,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 6px -1px rgba(0, 45, 104, 0.2)',
                                    "&:hover": {
                                        backgroundColor: "#004b93",
                                        boxShadow: '0 10px 15px -3px rgba(0, 45, 104, 0.3)',
                                    },
                                }}
                                onClick={() => {
                                    props.setIsAddButton(true);
                                    props.setEditData([]);
                                    props.setOpen(true);
                                }}
                                variant="extended" 
                                size="medium"
                            >
                                <AddIcon sx={{ mr: 1 }} />
                                Create New Template
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ChecklistTemplateTitle