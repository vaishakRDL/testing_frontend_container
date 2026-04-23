import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'
import { useState } from 'react'

const DeptMasterModel = ({open, setOpen, isAddButton, editDepartment, setRefreshData,setNotification}) => {
    const [deptName,setDeptName] = useState('');
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
                        {isAddButton ? 'Add Department' : 'Edit Department '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Department"
                                    placeholder='Department'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setDeptName(e.target.value) }}
                                    value={deptName}
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

export default DeptMasterModel
