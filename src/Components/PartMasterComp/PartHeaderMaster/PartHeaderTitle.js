import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ApplicationStore from '../../../Utility/localStorageUtil';

const PartHeaderTitle = (props) => {

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "itemmaster");

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
                Item Master Summary
            </Typography>
            <Box
                sx={{ m: 1 }}

            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        style={{ width: '100%', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                        disabled={userPermission[0]?.addData === 0}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditeData([]);
                            props.setOpen(true);
                        }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add Item Master
                    </Fab>
                </Stack>
            </Box>
        </Box>
    )
}

export default PartHeaderTitle