import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, Paper, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddTemplateLayout, UpdateTemplateLayout as UpdateBodyLayoutLists } from '../../ApiService/LoginPageService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const BodyChecklistItemModule = ({
    isAddButton, editData, /*setRefreshData,*/ setBodyCheckListModal, bodyCheckListModal, frequency, questionType, answerType, selectedLayout, seletcedRow, setRefresh, setIsAddButton
}) => {
    const [checklistName, setChecklistName] = useState('');
    const [description, setDescription] = useState('');
    const [department, setDepartment] = useState('')
    const [section, setSection] = useState('')
    const [documentVersion, setDocumentVersion] = useState('');
    // const [frequency, setFrequency] = useState('');
    const [template, setTemplate] = useState('');
    // const [answerType, setAnswerType] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [rowId, setRowId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    // const [selectedLayout, setSelectedLayout] = useState('Header');
    const [selectedLine1, setSelectedLine1] = useState('');
    const [selectedLine2, setSelectedLine2] = useState('');
    const [selectedLine3, setSelectedLine3] = useState('');
    const [selectedLine4, setSelectedLine4] = useState('');
    const [selectedLine5, setSelectedLine5] = useState('');
    const [selectedLine6, setSelectedLine6] = useState('');
    const [selectedLine7, setSelectedLine7] = useState('');
    const [selectedLine8, setSelectedLine8] = useState('');

    // NEW STATE
    const [checklistItem, setChecklistItem] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');

    const [objective1, setObjective1] = useState('');
    const [objective2, setObjective2] = useState('');

    const [userDefineData, setUserDefineData] = useState('');

    useEffect(() => {
        setBodyCheckListModal(bodyCheckListModal);
        !isAddButton && loaderData();
    }, [editData, bodyCheckListModal]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            layout: selectedLayout,
            frequency: frequency,
            questiontype: questionType,
            answertype: answerType,
            template: seletcedRow.id,
            checklistitem: {
                item: checklistItem,
                option1: questionType === 'multiple' ? option1 : objective1,
                option2: questionType === 'multiple' ? option2 : objective2,
                option3: option3,
                option4: option4,
            }
        };

        if (isAddButton) {
            AddTemplateLayout(data, handleSuccess, handleException);
        } else {
            UpdateBodyLayoutLists({ ...data, id: rowId }, handleSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefresh(preData => !preData);
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };
    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 2000);
    };

    const ClearData = () => {
        // setBodyCheckListModal(false);
        setIsAddButton(true)
        setChecklistItem('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
        setObjective1('');
        setObjective2('');
        setUserDefineData('');
    }

    const loaderData = () => {
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", editData)
        setRowId(editData?.id || '');
        setChecklistItem(editData.item || '');
        setOption1(editData?.option1 || '');
        setOption2(editData?.option2 || '');
        setOption3(editData?.option3 || '');
        setOption4(editData?.option4 || '');
        setObjective1(editData?.option1 || '');
        setObjective2(editData?.option2 || '');
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
            open={bodyCheckListModal}
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
                    {isAddButton ? 'Add Checklist Item [Body]' : 'Edit Checklist Item [Body]'}
                </Typography>
                <IconButton onClick={() => setBodyCheckListModal(false)} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
                <form onSubmit={handleSubmit}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                    {questionType === 'multiple' && answerType === 'multiple' &&
                        <Grid container spacing={3} >
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Checklist Item'
                                    value={checklistItem}
                                    onChange={(e) => setChecklistItem(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Option 1'
                                    value={option1}
                                    onChange={(e) => setOption1(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Option 2'
                                    value={option2}
                                    onChange={(e) => setOption2(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Option 3'
                                    value={option3}
                                    onChange={(e) => setOption3(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Option 4'
                                    value={option4}
                                    onChange={(e) => setOption4(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                        </Grid>}

                    {questionType === 'objective' && answerType === 'objective' &&
                        <Grid container spacing={3} >
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Checklist Item'
                                    value={checklistItem}
                                    onChange={(e) => setChecklistItem(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Objective 1'
                                    value={objective1}
                                    onChange={(e) => setObjective1(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Objective 2'
                                    value={objective2}
                                    onChange={(e) => setObjective2(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                        </Grid>
                    }

                    {questionType === 'fillInTheBlanks' && answerType === 'objective' &&
                        <Grid container spacing={3} >
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Checklist Item'
                                    value={checklistItem}
                                    onChange={(e) => setChecklistItem(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Objective 1'
                                    value={objective1}
                                    onChange={(e) => setObjective1(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Objective 2'
                                    value={objective2}
                                    onChange={(e) => setObjective2(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                        </Grid>
                    }

                    {questionType === 'fillInTheBlanks' && answerType === 'userData' &&
                        <Grid container spacing={3} >
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='Checklist Item'
                                    value={checklistItem}
                                    onChange={(e) => setChecklistItem(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    size='medium'
                                    fullWidth
                                    required
                                    label='User Define Data'
                                    value={objective1}
                                    onChange={(e) => setObjective1(e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                                />
                            </Grid>
                        </Grid>
                    }
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
                                '&:hover': { background: '#004b93' }
                            }}
                        >
                            {isAddButton ? 'Add Item' : 'Update Item'}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setBodyCheckListModal(false)
                                ClearData();
                            }}
                            sx={{ 
                                px: 4, 
                                borderRadius: 2, 
                                textTransform: 'none',
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

export default BodyChecklistItemModule