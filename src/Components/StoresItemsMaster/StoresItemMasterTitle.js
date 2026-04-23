import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

const StoresItemMasterTitle = (props) => {
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
            <Typography
                sx={{ m: 1 }}
                variant="h5"
            >
                Stores Items Master
            </Typography>

            <Box
                sx={{ m: 1 }}

            >
                <Grid container alignItems={'center'} spacing={2}>

                    <Grid item>
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
                    </Grid>

                    <Grid item>
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
                                Add Stores Item
                            </Fab>
                        </Stack>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
}

export default StoresItemMasterTitle