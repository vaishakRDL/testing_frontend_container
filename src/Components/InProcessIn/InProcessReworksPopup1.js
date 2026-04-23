import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, Select, TextField } from '@mui/material';
import React from 'react'

const InProcessReworksPopup1 = ({setopenRework,inProReworkOpen,}) => {

    const handleSubmit = () => {}
    // setOpen(false)
  return (
    <Dialog
    sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
    maxWidth="lg"
    open={inProReworkOpen}
>
    <DialogTitle style={{ background: '#002D68', color: 'white' }}>
        Rework
    </DialogTitle>
    <DialogContent style={{ paddingTop: '20px' }}>
        <form className="space-y-6" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Jobcard No */}

                <Grid item xs={6}>
                    <TextField
                        label="Q-test No"
                        variant="outlined"
                        fullWidth
                        required
                        // Add necessary props, e.g., onChange and value
                    />
                </Grid>
                <Grid item xs={6}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Reason</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Process"
                  variant="filled"
                
                >
                 
                </Select>
              </FormControl>
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
                <Grid item xs={6}>
                    <TextField
                        label="Remarks"
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
                        setopenRework(false);
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

export default InProcessReworksPopup1