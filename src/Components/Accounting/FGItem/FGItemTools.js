import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const FGItemTools = (props) => {
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
             FG Item
            </Typography>
            {/* <Box
                sx={{ m: 1 }}
                onClick={() => {
                    props.setIsAddButton(true);
                    // props.setEditDispatch([]);
                    props.setOpen(true);
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        style={{ background: '#002D68', color: 'white' }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add Dispatch
                    </Fab>
                </Stack>
            </Box> */}
        </Box>
    )
}

export default FGItemTools