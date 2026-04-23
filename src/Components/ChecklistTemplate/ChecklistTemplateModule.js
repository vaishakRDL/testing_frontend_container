import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, Typography, IconButton, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddTemplate, UpdateTemplate } from '../../ApiService/LoginPageService';

const ChecklistTemplateModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [rowId, setRowId] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [frequency, setFrequency] = useState('');

    useEffect(() => {
        if (!isAddButton && editData) {
            loaderData();
        } else {
            setTemplateName('');
            setTemplateDescription('');
            setFrequency('');
        }
    }, [editData, isAddButton, open]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name: templateName,
            description: templateDescription,
            frequency
        };

        if (isAddButton) {
            AddTemplate(data, handleSuccess, handleException);
        } else {
            UpdateTemplate({ ...data, id: rowId }, handleSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    };

    const ClearData = () => {
        setOpen(false);
        setTemplateName('');
        setTemplateDescription('');
        setFrequency('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '');
        setTemplateName(editData?.name || '');
        setTemplateDescription(editData?.description || '');
        setFrequency(editData?.frequency || '');
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '40%', borderRadius: 3, overflow: 'hidden' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #002D68 30%, #004b93 90%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 2
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                    {isAddButton ? "Add Checklist Template" : "Edit Checklist Template"}
                </Typography>
                <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
                <form onSubmit={handleSubmit}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label="Template Name"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Frequency</InputLabel>
                                    <Select
                                        label="Frequency"
                                        size='medium'
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                        sx={{ borderRadius: 1.5 }}
                                    >
                                        <MenuItem value={'DAILY'}>Daily</MenuItem>
                                        <MenuItem value={'MONTHLY'}>Monthly</MenuItem>
                                        <MenuItem value={'QUARTERLY'}>Quarterly</MenuItem>
                                        <MenuItem value={'SEMI_ANNUALLY'}>Semi Annually</MenuItem>
                                        <MenuItem value={'ANNUALLY'}>Annually</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                    label="Template Description"
                                    value={templateDescription}
                                    onChange={(e) => setTemplateDescription(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <DialogActions sx={{ px: 3, py: 3, mt: 2, borderTop: '1px solid #e2e8f0' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: '#002D68',
                                color: 'white',
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { background: '#004b93' }
                            }}
                        >
                            {isAddButton ? 'Create Template' : 'Update Template'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false)
                                ClearData();
                            }}
                            sx={{
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                borderColor: '#002D68',
                                color: '#002D68',
                                '&:hover': { borderColor: '#004b93', bgcolor: 'rgba(0, 45, 104, 0.04)' }
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default ChecklistTemplateModule
