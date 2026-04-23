import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const ProjectNameTitle = (props) => {

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "addprojectname");


    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Project")?.lockStatus === "locked";

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
                Project Name Summary
            </Typography>
            <Box
                sx={{ m: 1 }}

            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        style={{ width: '100%', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                        disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditData([]);
                            props.setOpen(true);
                        }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add Project Name
                    </Fab>
                </Stack>
            </Box>
        </Box>
    )
}

export default ProjectNameTitle