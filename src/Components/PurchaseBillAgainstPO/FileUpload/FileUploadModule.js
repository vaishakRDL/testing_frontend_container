import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { supplierUploadFile } from '../../../ApiService/LoginPageService';

const FileUploadModule = ({ fileUploadOpen, setFileUploadOpen, setSelectedFile }) => {

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={fileUploadOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                File Upload
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                variant="filled"
                                margin="dense"
                                // value={fileUpload}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setSelectedFile(reader.result);
                                                setFileUploadOpen(false);
                                                // setFile(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file" />
                        </Grid>



                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setFileUploadOpen(false);

                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default FileUploadModule;