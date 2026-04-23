import { Box, Typography } from '@mui/material';
import ApplicationStore from '../../Utility/localStorageUtil';

const PaintSludgeReportTitle = (props) => {

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "PaintSludgeReport");

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
               Paint Sludge Report
            </Typography>
            {/* <Box
                sx={{ m: 1 }}

            >
                <Stack direction="row" spacing={2}>
                    <Fab
                        style={{ width: '100%', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                        disabled={userPermission[0]?.addData === 0}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditDispatch([]);
                            props.setOpen(true);
                        }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add Dispatch
                    </Fab>
                </Stack>
            </Box> */}
        </Box>
    )
}

export default PaintSludgeReportTitle