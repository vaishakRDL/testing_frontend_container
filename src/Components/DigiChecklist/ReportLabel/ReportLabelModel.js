import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'
import { useState } from 'react'

const ReportLabelModel = ({open, setOpen, isAddButton, editReport, setRefreshData,setNotification}) => {
    const [reportLabel,setReportLabel] = useState('');
    const [description,setDescription] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '45%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}>
                <form >
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Add Report Label' : 'Edit Report Label '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Report Label"
                                    placeholder='Report Label'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setReportLabel(e.target.value) }}
                                    value={reportLabel}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    placeholder='Description'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setDescription(e.target.value) }}
                                    value={description}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}

                            type="submit"

                        >
                            {isAddButton ? 'Add' : 'Update'}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}

                            
                        >
                            Cancel
                        </Button>
                    </DialogActions>

                </form>
            </Dialog>
        
        </div>
    )
}

export default ReportLabelModel
