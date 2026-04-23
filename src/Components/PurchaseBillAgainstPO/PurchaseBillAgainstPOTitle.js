import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ApplicationStore from '../../Utility/localStorageUtil';

const PurchaseBillAgainstPOTitle = (props) => {
    const navigate = useNavigate();

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "purchasebillagainstpo");

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
                Purchase Bill Against PO
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
                                disabled={userPermission[0]?.addData === 0}
                                style={{ background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add"
                                onClick={() => {
                                    navigate(`/PurchaseBillAgainstPOModule`)
                                }}

                            >
                                <AddIcon sx={{ mr: 1 }} />
                                New - Purchase Bill Against PO
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default PurchaseBillAgainstPOTitle