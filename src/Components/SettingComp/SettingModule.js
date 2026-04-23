import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import React from 'react'

const SettingModule = ({ thresholdOpen, setThresholdOpen }) => {
    const handleClose = () => {
        setThresholdOpen(false);
    }
    return (
        <Dialog
            open={thresholdOpen}
            fullWidth={true}
            maxWidth='lg'
            sx={{ '& .MuiDialog-paper': { width: '90%', maxHeight: '100%' }, }}
        >
            <DialogTitle style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',

            }} >
                <Typography style={{ fontWeight: 'bold', fontSize: '25px' }}>
                    SET THRESHOLD
                </Typography>

            </DialogTitle>

            <DialogContent style={{ background: '#e3e4e6' }}>
                <Grid container spacing={2} style={{ marginTop: "20px" }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label=" Motor Name"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Asset Name"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Id"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Temperature"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Vibration"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Volt R"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Volt Y"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="Volt B"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="CUR R"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="CUR Y"
                            variant="filled"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                        <TextField
                            fullWidth
                            id="filled-basic"
                            label="CUR B"
                            variant="filled"
                            required
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions style={{ background: '#e3e4e6' }}>

                <Button
                    style={{
                        backgroundColor: '#022554',
                        borderRadius: '15px',
                        width: '150px',
                        marginTop: '5px'
                    }}
                    variant="contained"
                    onClick={handleClose}
                >
                    CANCEL
                </Button>
                <Button
                    style={{
                        backgroundColor: '#022554',
                        borderRadius: '15px',
                        width: '220px',
                        marginTop: '5px'
                    }}
                    variant="contained"
                    onClick={handleClose}
                >
                    SET THRESHOLD
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SettingModule