import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    DialogActions
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const ToolGrindingModule = ({
    open,
    setOpen,
    editData,       // ✅ selected row
    setRefreshData
}) => {

    const [rowId, setRowId] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [mode, setMode] = useState('START'); // START | END

    // ✅ when row selected
    useEffect(() => {
        if (editData) {
            setRowId(editData.id);
            setStartTime(editData.startGrind || '');
            setEndTime(editData.endGrind || '');

            // decide mode automatically
            if (editData.startGrind && !editData.endGrind) {
                setMode('END');
            } else {
                setMode('START');
            }
        }
    }, [editData]);

    // ✅ SUBMIT HANDLER
    const handleSubmit = () => {
        let payload = {};

        if (mode === 'START') {
            payload = {
                id: rowId,
                startTime
            };
        } else {
            payload = {
                id: rowId,
                endTime
            };
        }

        console.log('SEND TO BACKEND 👉', payload);

        // 🔴 CALL API HERE

        setRefreshData(prev => !prev);
        setOpen(false);
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle sx={{ background: '#002D68', color: '#fff' }}>
                {mode === 'START' ? 'Start Grinding' : 'End Grinding'}
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} mt={1}>

                    {/* START TIME */}
                    {mode === 'START' && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    )}

                    {/* END TIME */}
                    {mode === 'END' && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="End Time"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    )}

                </Grid>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={mode === 'START' ? !startTime : !endTime}
                >
                    Submit
                </Button>

                <Button variant="outlined" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ToolGrindingModule;
