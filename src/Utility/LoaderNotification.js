import { DialogContent } from '@material-ui/core'
import { Box, Button, CircularProgress, Dialog, DialogActions, Grid } from '@mui/material'
import React from 'react'

const LoaderNotification = ({ open, setOpen }) => {
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogContent>
                <Grid >
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                    
                }}>

                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default LoaderNotification
