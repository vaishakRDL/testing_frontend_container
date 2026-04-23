import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const UserAddTitle = (props) => {

  const { userDetails } = ApplicationStore()?.getStorage('userDetails');
  const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "adduser");

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "User")?.lockStatus === "locked";
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Typography
        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
        variant="h5"
      >
        User Summary
      </Typography>
      <Box>
        <Stack direction="row" spacing={2}>
          <Fab

            style={{ width: '100%', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
            onClick={() => {
              props.setIsAddButton(true);
              props.setEditData([]);
              props.setOpen(true);
            }}
            variant="extended" size="medium" color="#002D68" aria-label="add">
            <AddIcon sx={{ mr: 1 }} />
            Add User
          </Fab>
        </Stack>
      </Box>
    </Box>
  )
}

export default UserAddTitle