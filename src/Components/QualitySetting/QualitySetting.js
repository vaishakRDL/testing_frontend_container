import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Button, Card, CardContent, Box, FormGroup, FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QualitySetting = () => {

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Quality Setting
                </Typography>
            </div>
            <form>
                <Grid container spacing={2} padding={1} style={{ zoom: '80%' }}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Accordion defaultExpanded style={{ marginBottom: '30px' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                <Typography component="span" style={{ fontSize: '20px', fontWeight: 'bold' }}>Quality Rule1</Typography>
                                <Typography component="span" style={{ marginLeft: '30px', fontSize: '20px', fontWeight: 'bold' }}>1 - 10 Quantity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Production</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Assembly</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Incoming</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container >
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox defaultChecked />} label="All" />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </div>
                            </AccordionDetails>
                            <AccordionActions>
                                <Button>Cancel</Button>
                                <Button>Agree</Button>
                            </AccordionActions>
                        </Accordion>

                        <Accordion defaultExpanded style={{ marginBottom: '30px' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                <Typography component="span" style={{ fontSize: '20px', fontWeight: 'bold' }}>Quality Rule2</Typography>
                                <Typography component="span" style={{ marginLeft: '30px', fontSize: '20px', fontWeight: 'bold' }}>10 - 100 Quantity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Production</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Assembly</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Incoming</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container >
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox defaultChecked />} label="All" />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </div>
                            </AccordionDetails>
                            <AccordionActions>
                                <Button>Cancel</Button>
                                <Button>Agree</Button>
                            </AccordionActions>
                        </Accordion>

                        <Accordion defaultExpanded style={{ marginBottom: '30px' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                <Typography component="span" style={{ fontSize: '20px', fontWeight: 'bold' }}>Quality Rule3</Typography>
                                <Typography component="span" style={{ marginLeft: '30px', fontSize: '20px', fontWeight: 'bold' }}>100 - 500 Quantity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Production</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Assembly</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Incoming</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container >
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox defaultChecked />} label="All" />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </div>
                            </AccordionDetails>
                            <AccordionActions>
                                <Button>Cancel</Button>
                                <Button>Agree</Button>
                            </AccordionActions>
                        </Accordion>

                        <Accordion defaultExpanded style={{ marginBottom: '30px' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                <Typography component="span" style={{ fontSize: '20px', fontWeight: 'bold' }}>Quality Rule4</Typography>
                                <Typography component="span" style={{ marginLeft: '30px', fontSize: '20px', fontWeight: 'bold' }}>500 - 5000 Quantity</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Production</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Assembly</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE', marginBottom: '15px' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                </div>
                                <Typography style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>Incoming</Typography>
                                <div style={{ border: '1px solid #ADB2D4', borderRadius: '5px', padding: '10px', backgroundColor: '#EEEEEE' }}>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>FPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: '10px' }}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Observation: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container style={{}}>
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>LPI: Marks as completed Minimum Records</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField />
                                        </Grid>
                                    </Grid>
                                    <Grid container >
                                        <Grid item xs={12} sm={3} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox defaultChecked />} label="All" />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </div>
                            </AccordionDetails>
                            <AccordionActions>
                                <Button>Cancel</Button>
                                <Button>Agree</Button>
                            </AccordionActions>
                        </Accordion>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default QualitySetting;
