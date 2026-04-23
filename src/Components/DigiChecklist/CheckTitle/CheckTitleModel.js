import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React from 'react'
import { useState } from 'react'

const CheckTitleModel = ({open, setOpen, isAddButton, editTitle, setRefreshData,setNotification}) => {
    const [deptName,setDeptName] = useState('');
    const [deptNameList,setDeptNameList] = useState([]);
    const [sectionName,setSectionName] = useState('');
    const [sectionNameList,seSectionNameList] = useState([]);
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    const onDepartmentNameChange = (e) => {
        setDeptName(e.target.value);
    }

    const onSectionNameChange = (e) => {
        setSectionName(e.target.value);
    }


    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '45%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}>
                <form >
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Add Title' : 'Edit Title '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Department Name"
                                        placeholder='Department Name'
                                        value={deptName}
                                        required
                                        onChange={(e) => onDepartmentNameChange(e)}>
                                        {
                                            deptNameList?.map((data, index) => {
                                                return (
                                                    <MenuItem value={data.id} key={index}>{data.departmentName}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Section Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Section Name"
                                        placeholder='Section Name'
                                        value={sectionName}
                                        required
                                        onChange={(e) => onSectionNameChange(e)}>
                                        {
                                            sectionNameList?.map((data, index) => {
                                                return (
                                                    <MenuItem value={data.id} key={index}>{data.sectionName}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    placeholder='Title'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setTitle(e.target.value) }}
                                    value={title}
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

export default CheckTitleModel
