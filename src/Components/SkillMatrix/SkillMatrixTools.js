import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useModuleLocks } from '../context/ModuleLockContext';

const SkillMatrixTools = (props) => {

    // const { userDetails } = ApplicationStore().getStorage('userDetails');
    // const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "dispatchlist");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Shopfloor Documents")?.lockStatus === "locked";

    return (
        <Box
            sx={{
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
                Shopfloor Documents
            </Typography>
            <Box
                sx={{ m: 1 }}

            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        style={{ width: '100%', background: isModuleLocked ? '#ccc' : '#002D68', color: 'white', width: '200px' }}
                        // disabled={userPermission[0]?.addData === 0}
                        disabled={isModuleLocked}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditSkillMatrix([]);
                            props.setOpen(true);
                        }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add
                    </Fab>
                    <Fab
                        style={{ width: '100%', background: isModuleLocked ? '#ccc' : '#002D68', color: 'white', width: '250px' }}
                        // disabled={userPermission[0]?.addData === 0}
                        disabled={isModuleLocked}
                        onClick={() => {
                            // props.setIsMultipleAddButton(true);
                            // props.setEditSkillMatrix([]);
                            props.setMultipleOpen(true);
                        }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add Multiple File
                    </Fab>
                </Stack>
            </Box>
        </Box>
    )
}

export default SkillMatrixTools