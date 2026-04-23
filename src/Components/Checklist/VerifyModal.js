import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, Grid, DialogActions, Typography, Paper, Chip, IconButton, TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CellAssignModal from './CellAssignModal';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { GetChecklistExecutionDetails, GetChecklistVerifyLists, SubmitChecklistExecution } from '../../ApiService/LoginPageService';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WarningIcon from '@mui/icons-material/Warning';

const VerifyModal = ({
    isAddButton, editData, verifyModal, setVerifyModal, currentFrequency, viewRowId, selectedRowData, selectedDate, calenderDate, rowMaintId, setRowMaintId, isViewOnly
}) => {
    const [rowId, setRowId] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [cellAssignModal, setCellAssignModal] = useState(false);
    const [verifiedLists, setVerifiedLists] = useState([]);
    const [originalResponses, setOriginalResponses] = useState({});
    const [checklistDetails, setChecklistDetails] = useState(null);
    const [editCell, setEditCell] = useState(null);
    const [isBulkFilled, setIsBulkFilled] = useState(false);
    const preBulkFillState = useRef(null);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        const updateHeight = () => setScreenHeight(window.innerHeight);
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        if (verifyModal && selectedRowData) {
            const checklistId = selectedRowData.id || 1;
            setIsBulkFilled(false); // Reset toggled state 
            preBulkFillState.current = null;
            GetChecklistExecutionDetails(checklistId, handleGetListSuccess, handleGetListException);
        }
    }, [verifyModal, refreshData, selectedRowData]);

    const handleGetListSuccess = (dataObject) => {
        if (dataObject?.data?.checklistDetails) {
            setChecklistDetails(dataObject.data.checklistDetails);
        }

        const baseline = {};

        const transformedData = dataObject?.data?.items?.map((item, index) => {
            const rowData = {
                ...item,
                sno: index + 1,
                item: item?.question || 'N/A',
                answertype: item?.answer_type,
            };

            baseline[item.id] = {};

            // Map column responses to flat structure for Datagrid
            if (item.responses && Array.isArray(item.responses)) {
                item.responses.forEach(resp => {
                    const ansKey = `${resp.column}_answer`;
                    const remKey = `${resp.column}_remarks`;

                    rowData[ansKey] = resp.answer;
                    rowData[remKey] = resp.remarks;

                    baseline[item.id][ansKey] = resp.answer;
                    baseline[item.id][remKey] = resp.remarks || '';
                });
            }

            return rowData;
        }) || [];

        setOriginalResponses(baseline);
        setVerifiedLists(transformedData);
    };

    const handleGetListException = () => {
        setVerifiedLists([]);
    };

    const handleSuccess = (dataObject) => {
        setNotification({ status: true, type: 'success', message: dataObject.message });
        setTimeout(() => { ClearData(); handleClose(); }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setNotification({ status: true, type: 'error', message: errorMessage });
    };

    const ClearData = () => {
        setVerifyModal(false);
    };

    const handleClose = () => {
        setNotification({ status: false, type: '', message: '' });
    };

    // Dynamically generate columns based on frequency
    const columns = useMemo(() => {
        const freq = (checklistDetails?.frequency || currentFrequency || '').toLowerCase().replace(/-/g, '_').replace(/ /g, '_');

        const fixedCols = [
            {
                field: 'sno',
                headerName: '#',
                width: 60,
                align: 'center',
                headerAlign: 'center',
                headerClassName: 'super-app-theme--header',
                sortable: false,
                disableColumnMenu: true,
            },
            {
                field: 'item',
                headerName: 'Checklist Item',
                minWidth: 250,
                flex: 1,
                headerClassName: 'super-app-theme--header',
                sortable: false,
            },
            {
                field: 'objective_1',
                headerName: 'Objective 1',
                minWidth: 150,
                headerClassName: 'super-app-theme--header',
                sortable: false,
            },
            {
                field: 'objective_2',
                headerName: 'Objective 2',
                minWidth: 150,
                headerClassName: 'super-app-theme--header',
                sortable: false,
            }
        ];

        const renderDynamicCell = (params) => {
            const colField = params.field;
            const answer = params.row[`${colField}_answer`];
            const remarks = params.row[`${colField}_remarks`];

            if (!answer) {
                return (
                    <Box sx={{ width: '100%', height: '100%', backgroundColor: '#f0f4f8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0.5, borderRadius: 1 }}>
                        <Typography variant="caption" color="text.disabled">--</Typography>
                    </Box>
                );
            }

            const isOK = answer === 'OK';

            return (
                <Tooltip title={remarks || ''} arrow disableHoverListener={!remarks}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer' }}>
                        <Chip
                            label={answer}
                            size="small"
                            icon={!isOK ? <WarningIcon fontSize="small" sx={{ color: '#d32f2f' }} /> : undefined}
                            sx={{
                                backgroundColor: isOK ? '#e8f5e9' : '#ffebee',
                                color: isOK ? '#2e7d32' : '#c62828',
                                fontWeight: 'bold',
                                borderRadius: '4px',
                                minWidth: '40px'
                            }}
                        />
                    </Box>
                </Tooltip>
            );
        };

        let dynamicCols = [];

        if (freq === 'daily') {
            const dateObj = calenderDate ? new Date(calenderDate) : new Date();
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                dynamicCols.push({ field: String(day), headerName: String(day), width: 60 });
            }
        }
        else if (freq === 'monthly') {
            const months = ["APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR"];
            dynamicCols = months.map((m, i) => ({ field: String(i + 1), headerName: m, width: 80 }));
        }
        else if (freq === 'quarterly') {
            const quarters = ["Q1 (Apr-Jun)", "Q2 (Jul-Sep)", "Q3 (Oct-Dec)", "Q4 (Jan-Mar)"];
            dynamicCols = quarters.map((q, i) => ({ field: String(i + 1), headerName: q, width: 120 }));
        }
        else if (freq.includes('semi')) {
            const halves = ["H1 (Apr-Sep)", "H2 (Oct-Mar)"];
            dynamicCols = halves.map((h, i) => ({ field: String(i + 1), headerName: h, width: 150 }));
        }
        else if (freq === 'annually' || freq === 'yearly') {
            dynamicCols = [{ field: "1", headerName: "Yearly", width: 200 }];
        }

        const mappedDynamicCols = dynamicCols.map(col => ({
            ...col,
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            sortable: false,
            disableColumnMenu: true,
            renderCell: renderDynamicCell,
        }));

        return [...fixedCols, ...mappedDynamicCols];
    }, [checklistDetails, currentFrequency, calenderDate]);

    const handleCellClick = (params) => {
        if (isViewOnly) return;
        if (['item', 'sno', 'objective_1', 'objective_2'].includes(params.field)) return;

        const rowId = params.row.id;
        const colField = params.field;
        const answer = params.row[`${colField}_answer`];
        const remarks = params.row[`${colField}_remarks`];

        setEditCell({
            rowId,
            colField,
            question: params.row.item,
            answertype: params.row.answertype,
            answer: answer || '',
            remarks: remarks || '',
        });
    };

    const handleSaveCellEditor = () => {
        if (!editCell) return;

        setVerifiedLists(prev => prev.map(row => {
            if (row.id === editCell.rowId) {
                return {
                    ...row,
                    [`${editCell.colField}_answer`]: editCell.answer,
                    [`${editCell.colField}_remarks`]: editCell.remarks,
                };
            }
            return row;
        }));

        setEditCell(null);
    };

    const handleRowUpdate = (newRow, oldRow) => {
        console.log('Row updated from', oldRow, 'to', newRow);
        return newRow;
    };

    const handleBulkFillPass = () => {
        const dynamicFields = columns
            .filter(col => !['sno', 'item', 'objective_1', 'objective_2'].includes(col.field))
            .map(col => col.field);

        if (!isBulkFilled) {
            // Take a snapshot so we solely revert what we precisely filled!
            preBulkFillState.current = JSON.parse(JSON.stringify(verifiedLists));

            setVerifiedLists(prev => prev.map(row => {
                let isModified = false;
                const updatedRow = { ...row };

                dynamicFields.forEach(colField => {
                    // If it doesn't have an answer yet, fill it with 'OK'
                    if (!updatedRow[`${colField}_answer`]) {
                        updatedRow[`${colField}_answer`] = 'OK';
                        updatedRow[`${colField}_remarks`] = '';
                        isModified = true;
                    }
                });

                return isModified ? updatedRow : row;
            }));
            setIsBulkFilled(true);
        } else {
            // Revert ONLY cells that were magically filled empty beforehand and currently equal OK
            if (preBulkFillState.current) {
                setVerifiedLists(prev => prev.map(row => {
                    const updatedRow = { ...row };
                    const snapshotRow = preBulkFillState.current.find(r => r.id === row.id) || {};
                    let isModified = false;

                    dynamicFields.forEach(colField => {
                        // Restore it cleanly back to empty ONLY if it was natively empty but changed to OK
                        if (updatedRow[`${colField}_answer`] === 'OK' && !snapshotRow[`${colField}_answer`]) {
                            delete updatedRow[`${colField}_answer`];
                            delete updatedRow[`${colField}_remarks`];
                            isModified = true;
                        }
                    });

                    return isModified ? updatedRow : row;
                }));
            }
            setIsBulkFilled(false);
        }
    };

    const handleSubmitCheckList = () => {
        const checklistId = viewRowId || selectedRowData?.checkListId || 1;

        const responses = [];

        verifiedLists.forEach(row => {
            const itemId = row.id;
            const originalRow = originalResponses[itemId] || {};

            Object.keys(row).forEach(key => {
                if (key.endsWith('_answer') && row[key]) {
                    const colIndex = key.replace('_answer', '');
                    const answer = row[key];
                    const remarks = row[`${colIndex}_remarks`] || '';

                    const originalAnswer = originalRow[`${colIndex}_answer`];
                    const originalRemarks = originalRow[`${colIndex}_remarks`] || '';

                    // Only send if modified or new
                    if (answer !== originalAnswer || remarks !== originalRemarks) {
                        responses.push({
                            item_id: itemId,
                            column: colIndex,
                            answer: answer,
                            remarks: remarks
                        });
                    }
                }
            });
        });

        if (responses.length === 0) {
            setNotification({ status: true, type: 'success', message: 'No changes found to submit!' });
            setTimeout(() => { handleClose(); }, 1500);
            return;
        }

        const payload = {
            checklistId: checklistId,
            responses: responses
        };

        SubmitChecklistExecution(payload, handleCheckListSuccess, handleException);
    };

    const handleCheckListSuccess = (dataObject) => {
        setNotification({ status: true, type: 'success', message: dataObject.message || 'Submitted successfully!' });
        setTimeout(() => {
            handleClose();
            setRefreshData(prev => !prev);
        }, 1500);
    };

    return (
        <Dialog
            open={verifyModal}
            fullWidth
            maxWidth={false}
            scroll="paper"
            sx={{
                '& .MuiDialog-paper': {
                    width: '90vw',
                    height: '90vh',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f4f6f8'
                }
            }}
        >           {/* Header Section */}
            <Box sx={{
                pt: 2, pb: 2, px: 3,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#004286', letterSpacing: '-0.5px' }}>
                        Checklist Verification
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                        <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                            {checklistDetails?.template_name || selectedRowData?.checkname || 'Template Name'}
                        </Typography>
                        <Chip
                            label={(checklistDetails?.frequency || currentFrequency || 'Unknown').toUpperCase()}
                            size="small"
                            sx={{ backgroundColor: '#eef5ff', color: '#004286', fontWeight: 'bold', fontSize: '0.7rem' }}
                        />
                        <Chip
                            label={(checklistDetails?.status || 'PENDING').toUpperCase()}
                            size="small"
                            sx={{ backgroundColor: '#fff3e0', color: '#e65100', fontWeight: 'bold', fontSize: '0.7rem' }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {!isViewOnly && (
                        <Tooltip title={isBulkFilled ? "Undo Bulk Fill" : "Bulk Fill Pass (Fills empty cells with OK)"}>
                            <IconButton
                                onClick={handleBulkFillPass}
                                sx={{
                                    color: isBulkFilled ? '#e65100' : '#4caf50',
                                    backgroundColor: isBulkFilled ? '#fff3e0' : '#e8f5e9',
                                    '&:hover': { backgroundColor: isBulkFilled ? '#ffe0b2' : '#c8e6c9' }
                                }}
                            >
                                <DoneAllIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button
                        variant="outlined"
                        color="inherit"
                        sx={{ ml: 1, borderColor: '#ccc', color: '#444', textTransform: 'none', fontWeight: 600 }}
                        onClick={() => { ClearData(); handleClose(); }}
                    >
                        {isViewOnly ? "Close" : "Cancel"}
                    </Button>
                    {!isViewOnly && (
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#004286', '&:hover': { backgroundColor: '#003366' }, textTransform: 'none', fontWeight: 600, boxShadow: 'none' }}
                            onClick={handleSubmitCheckList}
                        >
                            Submit Verification
                        </Button>
                    )}
                </Box>
            </Box>

            <DialogContent sx={{ p: 3, backgroundColor: '#f4f6f8' }}>
                <Paper elevation={0} sx={{
                    height: screenHeight - 220,
                    width: '100%',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden'
                }}>
                    <DataGrid
                        rows={verifiedLists}
                        columns={columns}
                        rowHeight={48}
                        columnHeaderHeight={48}
                        onCellClick={handleCellClick}
                        disableRowSelectionOnClick
                        hideFooter
                        processRowUpdate={handleRowUpdate}
                        sx={{
                            border: 'none',
                            '& .super-app-theme--header': {
                                backgroundColor: '#f8fafc',
                                color: '#1e293b',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                borderRight: '1px solid #e2e8f0',
                                borderBottom: '2px solid #e2e8f0',
                            },
                            '& .MuiDataGrid-row': {
                                '&:nth-of-type(even)': { backgroundColor: '#fafafa' },
                                '&:hover': { backgroundColor: '#f0f4f8' },
                            },
                            '& .MuiDataGrid-cell': {
                                borderRight: '1px solid #f0f0f0',
                                borderBottom: '1px solid #f0f0f0',
                                color: '#333',
                                fontSize: '0.85rem',
                                '&:focus': { outline: 'none' },
                            },
                            '& .MuiDataGrid-cell--editable': {
                                minHeight: 'unset',
                                backgroundColor: '#ffffff',
                                cursor: 'text',
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none',
                            }
                        }}
                    />
                </Paper>
            </DialogContent>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <Dialog open={!!editCell} onClose={() => setEditCell(null)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#004286', color: '#fff' }}>Edit Answer</DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>{editCell?.question}</Typography>

                    {editCell?.answertype === 'YES_NO' ? (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant={editCell.answer === 'OK' ? 'contained' : 'outlined'}
                                    color="success"
                                    onClick={() => setEditCell(p => ({ ...p, answer: 'OK' }))}
                                >OK</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    fullWidth
                                    variant={editCell.answer === 'NOK' ? 'contained' : 'outlined'}
                                    color="error"
                                    onClick={() => setEditCell(p => ({ ...p, answer: 'NOK' }))}
                                >NOK</Button>
                            </Grid>
                        </Grid>
                    ) : (
                        <TextField
                            fullWidth
                            size="small"
                            label="Answer"
                            value={editCell?.answer || ''}
                            onChange={(e) => setEditCell(p => ({ ...p, answer: e.target.value }))}
                        />
                    )}

                    {editCell?.answer === 'NOK' && (
                        <TextField
                            fullWidth
                            size="small"
                            label="Remarks (Mandatory)"
                            required
                            sx={{ mt: 3 }}
                            value={editCell.remarks}
                            onChange={(e) => setEditCell(p => ({ ...p, remarks: e.target.value }))}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditCell(null)} color="inherit">Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={editCell?.answer === 'NOK' && !editCell?.remarks}
                        onClick={handleSaveCellEditor} dra
                    >Save</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default VerifyModal;