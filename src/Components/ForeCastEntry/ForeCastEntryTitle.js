import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ApplicationStore from '../../Utility/localStorageUtil';

const ForeCastEntryTitle = (props) => {
    const navigate = useNavigate();

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "forecastentry");

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
                Fore Cast Entry
            </Typography>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}

                        >
                            <Fab
                                style={{ width: '100%', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                disabled={userPermission[0]?.addData === 0}
                                onClick={() => {
                                    navigate(`/ForeCastEntryModule`)
                                }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                New - ForeCast Entry
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ForeCastEntryTitle