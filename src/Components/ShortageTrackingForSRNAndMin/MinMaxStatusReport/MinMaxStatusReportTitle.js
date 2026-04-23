import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';

const MinMaxStatusReportTitle = (props) => {

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
                // marginBottom: '25px',
                // marginTop: '25px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab' }}
                variant="h5"
            >
                Min Max Status Report
            </Typography>

            <Box
                sx={{ m: 1 }}

            >
                <Grid container alignItems={'center'} spacing={2}>

                    {/* <Grid item>
                        <div>
                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                sx={{ marginRight: '16px', backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                            >
                                Download Template
                            </Button>

                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                htmlFor="upload-photo"
                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                            >
                                Upload File
                            </Button>
                            <input
                                id="upload-photo"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                    </Grid> */}

                    {/* <Grid item>
                        <Stack direction="row" spacing={2}
                            onClick={() => {
                                props.setIsAddButton(true);
                                props.setEditeData([]);
                                props.setOpen(true);
                            }}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                Add Part
                            </Fab>
                        </Stack>
                    </Grid> */}

                </Grid>
            </Box>
        </Box>
    )
}

export default MinMaxStatusReportTitle