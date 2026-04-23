import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, Typography, IconButton, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddChecklist, UpdateChecklist, ShowTemplate } from '../../ApiService/LoginPageService';

const AddChecklistModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [rowId, setRowId] = useState('');
    const [checklistName, setChecklistName] = useState('');
    const [description, setDescription] = useState('');
    const [documentVersion, setDocumentVersion] = useState('');
    const [frequency, setFrequency] = useState('daily');
    const [template, setTemplate] = useState('');
    const [answerType, setAnswerType] = useState('userData');
    const [createdBy, setCreatedBy] = useState('Admin');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [templateList, setTemplateList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (!isAddButton && editData) {
            loaderData();
        } else {
            setChecklistName('');
            setDescription('');
            setDocumentVersion('');
            setFrequency('daily');
            setTemplate('');
            setAnswerType('userData');
            setCreatedBy('Admin');
            setFromDate('');
            setToDate('');
        }
    }, [editData, isAddButton, open]);

    useEffect(() => {
        if (open) {
            ShowTemplate(handleTemplateSucess, handleTemplateException);
        }
    }, [open])

    const handleTemplateSucess = (dataObject) => {
        setTemplateList(dataObject.data || []);
    }
    const handleTemplateException = () => { }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            checklistName: checklistName,
            description: description,
            documentVersion: documentVersion,
            // frequency: frequency,
            templateId: template,
            // answertype: answerType,
            createdBy: createdBy,
            // fromDate,
            // toDate
        };

        if (isAddButton) {
            AddChecklist(data, handleSuccess, handleException);
        } else {
            UpdateChecklist({ ...data, id: rowId }, handleSuccess, handleException);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
        setChecklistName('');
        setDescription('');
        setDocumentVersion('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '');
        setChecklistName(editData?.checklist_name || '');
        setDescription(editData?.description || '');
        setDocumentVersion(editData?.document_version || '');
        // setFrequency(editData?.frequency || 'daily');
        setTemplate(editData?.template_id || '');
        setAnswerType(editData?.answertype || 'userData');
        setCreatedBy(editData?.created_by || 'Admin');
        setFromDate(formatDate(editData?.from_date));
        setToDate(formatDate(editData?.to_date));
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
            sx={{ '& .MuiDialog-paper': { minWidth: '50%', borderRadius: 3, overflow: 'hidden' } }}
            maxWidth="lg"
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
                    {isAddButton ? "Add Checklist" : "Edit Checklist"}
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
                                    label="Checklist Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    size='medium'
                                    value={checklistName}
                                    onChange={(e) => setChecklistName(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Document Version"
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    value={documentVersion}
                                    onChange={(e) => setDocumentVersion(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Template</InputLabel>
                                    <Select
                                        label="Template"
                                        size='medium'
                                        value={template}
                                        onChange={(e) => setTemplate(e.target.value)}
                                        sx={{ borderRadius: 1.5 }}
                                        required
                                    >
                                        {templateList.map((data) => (
                                            <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Created By"
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    value={createdBy}
                                    onChange={(e) => setCreatedBy(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={3}>
                                <TextField
                                    label="From Date"
                                    type="date"
                                    variant="outlined"
                                    size="medium"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="To Date"
                                    type="date"
                                    variant="outlined"
                                    size="medium"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid> */}
                        </Grid>
                    </Paper>

                    <DialogActions sx={{ px: 0, py: 3, mt: 2, borderTop: '1px solid #e2e8f0' }}>
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
                            {isAddButton ? 'Add Checklist' : 'Update Checklist'}
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

export default AddChecklistModule
