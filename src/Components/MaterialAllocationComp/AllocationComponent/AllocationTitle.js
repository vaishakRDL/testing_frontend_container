import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { ShowSFG, SFGDelete, GetAllocationRowData, MaterialAllocate, AllocateAutomatically } from '../../../ApiService/LoginPageService';

const AllocationTitle = (props) => {
    const { allocationId, setRefreshData, handleAllocateSuccess, handleAllocateFailed, allocateAutomaticLoader, setAllocateAutomaticLoader } = props;

    const handleAllocateAutomatically = () => {
        setAllocateAutomaticLoader(true);
        AllocateAutomatically({ id: allocationId }, handleAllocateSuccess, handleAllocateFailed)
    }

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
            <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                <Link to='/MaterialAllocationResult' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Material Allocation>>`}
                    </Typography>
                </Link>
                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    Allocation
                </Typography>
            </div>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}
                            // onClick={() => {
                            //     props.setIsAddButton(true);
                            //     props.setEditData([]);
                            //     props.setOpen(true);
                            // }}
                            onClick={handleAllocateAutomatically}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                {/* <AddIcon sx={{ mr: 1 }} /> */}
                                {allocateAutomaticLoader ? "Allocating..." : "Allocate Automatically"}
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default AllocationTitle