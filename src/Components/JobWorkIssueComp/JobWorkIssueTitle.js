import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';

const JobWorkIssueTitle = (props) => {
    const navigate = useNavigate();

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
                marginTop: '10px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                Job Work Issue
            </Typography>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}
                            onClick={() => {
                                navigate(`/JobWorkIssueModal?newEntry=true`)
                            }}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                New - Job Work Issue
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default JobWorkIssueTitle