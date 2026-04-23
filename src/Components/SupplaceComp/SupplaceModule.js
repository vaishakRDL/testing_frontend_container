import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'

const SupplaceModule = ({
    open, setOpen, isAddButton, customerData, setRefreshData,
}) => {
    const handleSubmit = () => {

    }
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '45%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Supply Place' : 'Edit Supply Place'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Supply Place"
                                placeholder='Supply Place'
                                variant="filled"
                                required
                                size='small'

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                placeholder='Description'
                                variant="filled"
                                required
                                size='small'
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
                        onClick={(e) => {
                            setOpen(false);

                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>

            </form>
        </Dialog>
    )
}

export default SupplaceModule