import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Display, Digit } from 'react-7-segment-display';

const MotoModule = ({ open, setOpen }) => {
    const [foundTempNeg, setFoundTempNeg] = useState(null);
    const [temperature, setTemperature] = useState(25.456);
    const [vibration, setVibration] = useState(0);
    const [voltageR, setVoltageR] = useState(0);
    const [voltageY, setVoltageY] = useState(0);
    const [voltageB, setVoltageB] = useState(0);
    const [currentR, setCurrentR] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [currentB, setCurrentB] = useState(0);
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <Dialog
            open={open}
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
                    MOTOR 1
                </Typography>

            </DialogTitle>
            <DialogContent style={{ background: '#e3e4e6' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={12} xl={12}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-around'
                                }}>
                                <Typography style={{ fontWeight: 'bold', fontSize: '25px' }}>
                                    TEMPERATUR
                                </Typography>

                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={12} xl={12}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-around'
                                }}>
                                {foundTempNeg !== null && foundTempNeg < 0 && (
                                    <Typography sx={{ color: 'red', fontSize: '3rem', marginRight: '-2rem', zIndex: 1 }} variant="button" display="block" gutterBottom>
                                        -
                                    </Typography>
                                )}
                                <Display
                                    color={'red'}
                                    height={50}
                                    backgroundColor={'black'}
                                    value={temperature}
                                    count={5}
                                    style={{ marginLeft: '-0.5rem' }}
                                >
                                    <Digit />
                                </Display>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={12} xl={12}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-around'
                                }}>
                                <Typography style={{ fontWeight: 'bold', fontSize: '25px' }}>
                                    VIBRATION
                                </Typography>

                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={12} xl={12}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-around'
                                }}>

                                <Display
                                    color={'red'}
                                    height={50}
                                    backgroundColor={'black'}
                                    value={vibration}
                                    count={2}
                                >
                                    <Digit />
                                </Display>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography style={{ fontWeight: 'bold', fontSize: '25px' }}>
                            VIBRATION
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}  container direction="column" alignItems="center">
                        <Typography sx={{ color: "black", marginBottom: 0, fontSize: '1.5rem' }} variant="button" display="block" gutterBottom>
                            R
                        </Typography>
                        <Display
                            color={'red'}
                            height={60}
                            backgroundColor={'black'}
                            value={voltageR}
                            count={3}
                        >
                            <Digit />
                        </Display>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}  container direction="column" justifyContent="center" alignItems="center">
                        <Typography sx={{ color: "black", marginBottom: 0, fontSize: '1.5rem' }} variant="button" display="block" gutterBottom>
                            Y
                        </Typography>
                        <Display
                            color={'red'}
                            height={60}
                            backgroundColor={'black'}
                            value={voltageY}
                            count={3}
                        >
                            <Digit />
                        </Display>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}  container direction="column" justifyContent="center" alignItems="center">
                        <Typography sx={{ color: "black", marginBottom: 0, fontSize: '1.5rem' }} variant="button" display="block" gutterBottom>
                            B
                        </Typography>
                        <Display
                            color={'red'}
                            height={60}
                            backgroundColor={'black'}
                            value={voltageB}
                            count={3}
                        >
                            <Digit />
                        </Display>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography style={{ fontWeight: 'bold', fontSize: '25px' }}>
                            CURRENT
                        </Typography>
                    </Grid>
                    <Grid item xs={4} container direction="column" justifyContent="center" alignItems="center">
                        <Typography sx={{ color: "blck", marginBottom: 0, fontSize: '1.5rem' }} variant="button" display="block" gutterBottom>
                            I1
                        </Typography>
                        <Display
                            color={'red'}
                            height={60}
                            backgroundColor={'black'}
                            value={currentR}

                        >
                            <Digit />
                        </Display>
                    </Grid>
                    <Grid item xs={4} container direction="column" justifyContent="center" alignItems="center">
                        <Typography sx={{ color: "blck", marginBottom: 0, fontSize: '1.5rem' }} variant="button" display="block" gutterBottom>
                            I2
                        </Typography>
                        <Display
                            color={'red'}
                            height={60}
                            backgroundColor={'black'}
                            value={currentY}

                        >
                            <Digit />
                        </Display>
                    </Grid>
                    <Grid item xs={4} container direction="column" justifyContent="center" alignItems="center">
                        <Typography sx={{ color: "blck", marginBottom: 0, fontSize: '1.5rem' }} variant="button" display="block" gutterBottom>
                            I3
                        </Typography>
                        <Display
                            color={'red'}
                            height={60}
                            backgroundColor={'black'}
                            value={currentB}

                        >
                            <Digit />
                        </Display>
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
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MotoModule