import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'

const InProcessReworkApprovedPopup = ({setOpenReworkApprovedPopup,openReworkApprovedPopup,}) => {

    const handleSubmit = () => {}
   
  return (
    <Dialog
    sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
    maxWidth="lg"
    open={openReworkApprovedPopup}
>
    <DialogTitle style={{ background: '#002D68', color: 'white' }}>
        Approved
    </DialogTitle>
    <DialogContent style={{ paddingTop: '20px' }}>
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Jobcard No */}

                <Grid item xs={6}>
                    <TextField
                        label="Q -Test No"
                        variant="outlined"
                        fullWidth
                        required
                        // Add necessary props, e.g., onChange and value
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Jobcard No"
                        variant="outlined"
                        fullWidth
                        required
                        // Add necessary props, e.g., onChange and value
                    />
                </Grid>

                {/* Serial No */}
                <Grid item xs={6}>
                    <TextField
                        label="Serial No"
                        variant="outlined"
                        fullWidth
                        required
                        // Add necessary props, e.g., onChange and value
                    />
                </Grid>
            </Grid>

            <DialogActions>
                
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    type='submit'
                >
                   submit
                </Button>
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={() => {
                        setOpenReworkApprovedPopup(false);
                    }}
                >
                   Cancel
                </Button>
            </DialogActions>
        </form>
    </DialogContent>
    {/* <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
    /> */}
</Dialog>

  )
}

export default InProcessReworkApprovedPopup;