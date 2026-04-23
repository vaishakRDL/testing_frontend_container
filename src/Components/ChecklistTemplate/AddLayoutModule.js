import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, Paper, Divider, IconButton, Alpha,
    Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import BodyChecklistItemModule from './BodyChecklistItemModule';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import {
    UpdateTemplateLayout,
    DeleteBodyLayoutLists,
    AddTemplateFields,
    AddTemplateItems,
    GetHeaderFooterData,
    GetBodyLayoutLists,
    TemplateSectionList
} from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';


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

const AddLayoutModule = ({
    // isAddButton,
    editData,
    /*setRefreshData,*/
    setLayoutModuleOpen,
    layoutModuleOpen,
    seletcedRow
}) => {
    const [rowId, setRowId] = useState('');
    const [selectedLayout, setSelectedLayout] = useState('footer');

    // DYNAMIC HEADER/FOOTER STATE
    const [headerFields, setHeaderFields] = useState([
        { id: 1, label: '', field_type: 'TITLE', default_value: '', required: false },
        { id: 2, label: '', field_type: 'TEXT', default_value: '', required: false }
    ]);
    const [footerFields, setFooterFields] = useState([
        { id: 1, label: '', field_type: 'TEXT', default_value: '', required: false }
    ]);

    // BODY STATES
    const [bodyCheckListModal, setBodyCheckListModal] = useState();
    const [frequency, setFrequency] = useState('monthly');
    const [questionType, setQuestionType] = useState('');
    const [answerType, setAnswerType] = useState('');
    const [bodyChecklists, setBodyChecklists] = useState([]);
    const [bodyItems, setBodyItems] = useState([]); // Array for spreadsheet-like editing
    const [gridData, setGridData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    // HEADER_FOOTER VIEW DATA
    const [HeaderFooterViewData, setHeaderFooterViewData] = useState([]);
    const [editable, setEditable] = useState(false);

    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('');

    const [isAddButton, setIsAddButton] = useState(true);
    const [editRowData, setEditRowData] = useState([]);
    const [layOutId, setLayOutId] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState('');

    useEffect(() => {
        if (layoutModuleOpen && seletcedRow?.id) {
            TemplateSectionList({ id: seletcedRow.id }, (response) => {
                setSections(response?.data || []);
            }, (err) => {
                console.error("Error fetching sections:", err);
            });
        }
    }, [layoutModuleOpen, seletcedRow?.id]);

    useEffect(() => {
        setLayoutModuleOpen(layoutModuleOpen);
    }, [editData]);

    // Logic to handle Body items fetching
    useEffect(() => {
        if (layoutModuleOpen && selectedLayout === 'body') {
            GetBodyLayoutLists({ id: seletcedRow.id, frequency: frequency, selectedLayout: selectedLayout }, handleBodylistsSuccess, handleBodylistsException)
        }
    }, [layoutModuleOpen, selectedLayout, refresh, frequency]);

    // Logic to handle Header/Footer fields fetching (Waiting for section ID)
    useEffect(() => {
        if (layoutModuleOpen && (selectedLayout === 'footer' || selectedLayout === 'header') && selectedSection) {
            GetHeaderFooterData({ id: seletcedRow.id, selectedLayout: selectedLayout, sectionId: selectedSection }, handleHeaderFooterSuccess, handleHeaderFooterException);
        }
    }, [layoutModuleOpen, selectedSection, refresh]);

    // Final synchronization of selectedSection from sections list
    useEffect(() => {
        if (sections.length > 0 && selectedLayout) {
            const currentSection = sections.find(s => {
                const searchStr = (s.section || s.section_name || s.layout_type || s.type || s.name || '').toLowerCase();
                const targetStr = selectedLayout.toLowerCase();
                return searchStr === targetStr || searchStr.includes(targetStr);
            });
            
            if (currentSection) {
                setSelectedSection(currentSection.id);
            }
        }
    }, [selectedLayout, sections]);

    const handleHeaderFooterSuccess = (dataObject) => {
        const fields = dataObject?.data || [];
        const formattedFields = fields.length > 0 ? fields.map((f, index) => ({
            id: f.id || index + 1,
            label: f.label || '',
            field_type: (f.field_type || 'TEXT').toUpperCase(),
            default_value: f.value || f.default_value || '',
            required: f.is_required === 1 || f.required || false
        })) : [
            { id: 1, label: '', field_type: 'TEXT', default_value: '', required: false }
        ];

        if (selectedLayout === 'footer') {
            setFooterFields(formattedFields);
            setEditable(true);
        } else if (selectedLayout === 'header') {
            setHeaderFields(formattedFields);
            setEditable(true);
        }
    };

    const handleHeaderFooterException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 2000);
    };
    const handleBodylistsSuccess = (dataObject) => {
        const data = dataObject?.data || [];
        const flatItems = [];

        if (Array.isArray(data) && data.length > 0) {
            data.forEach((obj, index) => {
                flatItems.push({
                    id: obj.id || index + 1,
                    item: obj.question || obj.item || '',
                    option1: obj.objective_1 || obj.option1 || '',
                    option2: obj.objective_2 || obj.option2 || '',
                    answer_type: (obj.answer_type || 'YES_NO').toUpperCase()
                });
            });
        }

        setBodyItems(flatItems.length > 0 ? flatItems : [{ id: 1, item: '', option1: '', option2: '', answer_type: 'YES_NO' }]);
        setEditable(true);
    }

    const handleBodylistsException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 2000);
    }
    const handleAddRow = () => {
        const newId = bodyItems.length > 0 ? Math.max(...bodyItems.map(i => i.id || 0)) + 1 : 1;
        setBodyItems([...bodyItems, { id: newId, item: '', option1: '', option2: '', answer_type: 'YES_NO' }]);
    };

    const handleRowChange = (index, field, value) => {
        const newItems = [...bodyItems];
        newItems[index][field] = value;
        setBodyItems(newItems);
    };

    const handleDeleteRow = (index) => {
        const newItems = bodyItems.filter((_, i) => i !== index);
        setBodyItems(newItems.length > 0 ? newItems : [{ id: 1, item: '', option1: '', option2: '', answer_type: 'YES_NO' }]);
    };

    const handleAddField = () => {
        const fields = selectedLayout === 'header' ? headerFields : footerFields;
        const setFields = selectedLayout === 'header' ? setHeaderFields : setFooterFields;
        const newId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
        setFields([...fields, { id: newId, label: '', field_type: 'TEXT', default_value: '', required: false }]);
    };

    const handleFieldChange = (index, field, value) => {
        const fields = selectedLayout === 'header' ? [...headerFields] : [...footerFields];
        const setFields = selectedLayout === 'header' ? setHeaderFields : setFooterFields;
        fields[index][field] = value;
        setFields(fields);
    };

    const handleDeleteField = (index) => {
        const fields = selectedLayout === 'header' ? [...headerFields] : [...footerFields];
        const setFields = selectedLayout === 'header' ? setHeaderFields : setFooterFields;
        if (fields.length > 1) {
            const newFields = fields.filter((_, i) => i !== index);
            setFields(newFields);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (selectedLayout === 'body') {
            if (bodyItems.some(i => !i.item.trim())) {
                setNotification({ status: true, type: 'error', message: 'All checklist items are required' });
                return;
            }

            const itemsPayload = {
                templateId: seletcedRow.id,
                items: bodyItems.map(row => ({
                    question: row.item,
                    objective_1: row.option1,
                    objective_2: row.option2,
                    answer_type: (row.answer_type || 'YES_NO').toUpperCase(),
                    frequency: frequency.toUpperCase()
                }))
            };

            AddTemplateItems(itemsPayload, handleSuccess, handleException);
        } else {
            const currentFields = selectedLayout === 'header' ? headerFields : footerFields;
            const validFields = currentFields.filter(f => f.label.trim() !== '');

            if (validFields.length === 0) {
                setNotification({ status: true, type: 'error', message: 'At least one field label is required' });
                return;
            }

            let finalSectionId = selectedSection;

            // Final fallback lookup to ensure sectionId is present
            if (!finalSectionId && sections.length > 0) {
                const autoSection = sections.find(s => {
                    const searchStr = (s.section || '').toLowerCase();
                    const targetStr = selectedLayout.toLowerCase();
                    return searchStr === targetStr || searchStr.includes(targetStr);
                });
                if (autoSection) finalSectionId = autoSection.id;
            }

            if (!finalSectionId) {
                setNotification({ status: true, type: 'error', message: 'No matching section found for this layout' });
                return;
            }

            const fieldsPayload = {
                sectionId: finalSectionId,
                fields: validFields.map(f => ({
                    label: f.label,
                    field_type: f.field_type.toUpperCase()
                }))
            };

            AddTemplateFields(fieldsPayload, handleSuccess, handleException);
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
        setTimeout(() => {
        }, 2000);
    };

    const ClearData = () => {
        setNotification('');
        setFrequency('monthly');
        setQuestionType('');
        setAnswerType('');
        setSelectedLayout('header');
        setHeaderFields([
            { id: 1, label: '', field_type: 'TITLE', default_value: '', required: false },
            { id: 2, label: '', field_type: 'TEXT', default_value: '', required: false }
        ]);
        setFooterFields([
            { id: 1, label: '', field_type: 'TEXT', default_value: '', required: false }
        ]);
        setBodyItems([{ id: 1, item: '', option1: '', option2: '', answer_type: 'YES_NO' }]);
    }

    const loaderData = () => {
        setRowId(editData?.id || '');
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const multipleColumns = [
        {
            field: 'item',
            headerClassName: 'super-app-theme--header',
            headerName: 'Checklist Item',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'option1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Option 1',

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'option2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Option 2',

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'option3',
            headerClassName: 'super-app-theme--header',
            headerName: 'Option 3',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'option4',
            headerClassName: 'super-app-theme--header',
            headerName: 'Option 4',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];
    const objectiveColumns = [
        {
            field: 'item',
            headerClassName: 'super-app-theme--header',
            headerName: 'Checklist Item',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'option1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Objective 1',

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'option2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Objective 2',

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function EditData(props) {
        return (
            <EditIcon
                onClick={(event) => {
                    setIsAddButton(false);
                    setEditRowData(props.selectedRow);
                    setBodyCheckListModal(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: 'black' }}
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
            />
        );
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefresh((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 3000);
    };



    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={layoutModuleOpen}
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
                    {`CheckList Template [${selectedLayout.toUpperCase()}]`}
                </Typography>
                <IconButton onClick={() => setLayoutModuleOpen(false)} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
                <form onSubmit={handleSubmit}>
                    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="layout-select-label">Select Layout</InputLabel>
                                    <Select
                                        labelId="layout-select-label"
                                        id="layout-select"
                                        label="Select Layout"
                                        size="medium"
                                        value={selectedLayout}
                                        onChange={(e) => setSelectedLayout(e.target.value)}
                                        sx={{ borderRadius: 1.5, bgcolor: 'white' }}
                                    >
                                        <MenuItem value={'header'}>Header</MenuItem>
                                        <MenuItem value={'body'}>Body</MenuItem>
                                        <MenuItem value={'footer'}>Footer</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* {selectedLayout === 'body' && (
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="section-select-label">Select Section</InputLabel>
                                    <Select
                                        labelId="section-select-label"
                                        id="section-select"
                                        label="Select Section"
                                        size="medium"
                                        value={selectedSection}
                                        onChange={(e) => setSelectedSection(e.target.value)}
                                        sx={{ borderRadius: 1.5, bgcolor: 'white' }}
                                    >
                                        {sections.length > 0 ? (
                                            sections.map((sec) => (
                                                <MenuItem key={sec.id} value={sec.id}>{sec.section_name || sec.name || `Section ${sec.id}`}</MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No Sections Found</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            )} */}
                        </Grid>
                    </Paper>

                    {(selectedLayout === 'header' || selectedLayout === 'footer') && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#002D68' }}>
                                        {selectedLayout.toUpperCase()} Field Builder
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddField}
                                        sx={{
                                            bgcolor: '#059669',
                                            '&:hover': { bgcolor: '#047857' },
                                            borderRadius: 2,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Add Field
                                    </Button>
                                </Box>

                                <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                    <Table>
                                        <TableHead sx={{ bgcolor: '#002D68' }}>
                                            <TableRow>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '70px', textAlign: 'center' }}>#</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Field Label</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '200px' }}>Field Type</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Default / Hint Text</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '100px', textAlign: 'center' }}>Required</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '80px', textAlign: 'center' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(selectedLayout === 'header' ? headerFields : footerFields).map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:hover': { bgcolor: '#f1f5f9' },
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                >
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <Avatar sx={{
                                                            bgcolor: '#002D68',
                                                            width: 28,
                                                            height: 28,
                                                            fontSize: '0.75rem',
                                                            mx: 'auto'
                                                        }}>
                                                            {index + 1}
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 1.5 }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder={selectedLayout === 'footer' ? (index === 0 ? "e.g. Inspector Name" : "e.g. Signature") : "Label name..."}
                                                            value={row.label}
                                                            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'white' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            fullWidth
                                                            size="small"
                                                            value={row.field_type}
                                                            onChange={(e) => handleFieldChange(index, 'field_type', e.target.value)}
                                                            sx={{ borderRadius: 1.5, bgcolor: 'white' }}
                                                        >
                                                            <MenuItem value="TEXT">TEXT (Input)</MenuItem>
                                                            <MenuItem value="FILE">FILE (Upload/Signature)</MenuItem>
                                                            <MenuItem value="DATE">DATE Picker</MenuItem>
                                                            <MenuItem value="TITLE">TITLE (Heading)</MenuItem>
                                                            <MenuItem value="NUMBER">NUMBER</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder={row.field_type === 'FILE' ? "e.g. Please sign above" : "Default value..."}
                                                            value={row.default_value}
                                                            onChange={(e) => handleFieldChange(index, 'default_value', e.target.value)}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'white' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <Checkbox
                                                            checked={row.required}
                                                            onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                                                            sx={{ color: '#002D68', '&.Mui-checked': { color: '#002D68' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleDeleteField(index)}
                                                            disabled={(selectedLayout === 'header' ? headerFields : footerFields).length <= 1}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    )}
                    {selectedLayout === 'body' && (
                        <Box sx={{ mt: 3 }}>
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: 'white' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#002D68' }}>
                                        BODY Checklist Item Builder
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        {/* Frequency context label or selector could go here if needed */}
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddRow}
                                            sx={{
                                                bgcolor: '#059669',
                                                '&:hover': { bgcolor: '#047857' },
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                px: 3
                                            }}
                                        >
                                            Add Checklist Item
                                        </Button>
                                    </Box>
                                </Box>

                                <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                    <Table>
                                        <TableHead sx={{ bgcolor: '#002D68' }}>
                                            <TableRow>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '60px', textAlign: 'center' }}>#</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Checklist Item</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Objective 1</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Objective 2</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '180px' }}>Answer Type</TableCell>
                                                <TableCell sx={{ color: 'white', fontWeight: 600, width: '80px', textAlign: 'center' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bodyItems.map((row, index) => (
                                                <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                                    <TableCell sx={{ textAlign: 'center', fontWeight: 500 }}>{index + 1}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Enter checklist item description..."
                                                            value={row.item}
                                                            onChange={(e) => handleRowChange(index, 'item', e.target.value)}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'white' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Target / Objective 1"
                                                            value={row.option1}
                                                            onChange={(e) => handleRowChange(index, 'option1', e.target.value)}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'white' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Target / Objective 2"
                                                            value={row.option2}
                                                            onChange={(e) => handleRowChange(index, 'option2', e.target.value)}
                                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: 'white' } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}>
                                                        <Select
                                                            fullWidth
                                                            size='small'
                                                            value={row.answer_type}
                                                            onChange={(e) => handleRowChange(index, 'answer_type', e.target.value)}
                                                            sx={{ borderRadius: 1.5 }}
                                                        >
                                                            <MenuItem value={'YES_NO'}>Yes / No</MenuItem>
                                                            <MenuItem value={'TEXT'}>Text Input</MenuItem>
                                                            <MenuItem value={'MULTIPLE'}>Multiple</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDeleteRow(index)}
                                                            sx={{ '&:hover': { bgcolor: '#fee2e2' } }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    )}

                    <DialogActions sx={{ px: 4, py: 3, borderTop: '1px solid #e2e8f0', bgcolor: 'white', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #002D68 0%, #004b93 100%)',
                                color: 'white',
                                px: 4,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    background: '#002D68',
                                    boxShadow: '0 4px 12px rgba(0, 45, 104, 0.3)'
                                }
                            }}
                        >
                            Save All Changes
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setLayoutModuleOpen(false)
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
                            Close
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
            <BodyChecklistItemModule
                setBodyCheckListModal={setBodyCheckListModal}
                bodyCheckListModal={bodyCheckListModal}
                frequency={frequency}
                questionType={questionType}
                answerType={answerType}
                selectedLayout={selectedLayout}
                seletcedRow={seletcedRow}
                setRefresh={setRefresh}
                editData={editRowData}
                isAddButton={isAddButton}
                setIsAddButton={setIsAddButton}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                // deleteService={DeleteBodyLayoutLists}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </Dialog>
    )
}

export default AddLayoutModule