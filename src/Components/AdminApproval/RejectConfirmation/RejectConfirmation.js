import React, { useState } from 'react';
import { WarningAmber } from '@mui/icons-material';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function RejectConfirmation(props) {
    const { remarks, setRemarks } = props;

    function onSubmit() {
        if (props.priceFlag === 'Price') {
            // props.deleteService({ id: props.deleteId.id, sighn: '1', newRate: props.deleteId.newRate, supItmId: props.deleteId.supItmId, remarks: remarks }, props.handleSuccess, props.handleException);
            const filteredArray = props.rows
                .filter(row => row.selected)
                .map(row => ({
                    id: row.id,
                    sighn: 1,
                    newRate: row.newRate,
                    supItmId: row.supItmId,
                    remarks: remarks
                }));
            props.deleteService({ items: filteredArray }, props.handleSuccess, props.handleException);
        } else {
            props.deleteService({ id: props.deleteId, status: '2', remarks: remarks }, props.handleSuccess, props.handleException)
        }
    }
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
            open={props.open}
        >
            <DialogTitle sx={{ textAlign: 'center' }}>
                <ThumbDownIcon color="#D24545" style={{ fontSize: 95, color: '#D24545' }} />
            </DialogTitle>
            <DialogContent sx={{
                mt: 1,
                textAlign: 'center', fontFamily: 'customfont',
                letterSpacing: '0.5px',
                marginTop: '0px'
            }}>
                <Typography
                    sx={{
                        m: 1,
                        fontFamily: 'customfont',
                        letterSpacing: '0.5px',
                        padding: '10px 0'
                    }}
                    variant="h5"
                    component="span"
                >
                    Confirm Action
                </Typography>
                <br />
                This process cannot be undone.
                <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Reason for rejection"
                    multiline
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ margin: '10px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Button onClick={() => { onSubmit(); }}
                        style={{
                            background: 'rgb(19 60 129)',
                        }}
                        sx={{
                            height: '0',
                            color: 'white',
                            padding: "10px 19px",
                            fontSize: '13px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontFamily: 'customfont',
                            letterSpacing: '1px',
                            boxShadow: 'none',
                            marginRight: '20px',
                            marginBottom: '20px'
                        }}>
                        Confirm
                    </Button>
                    <Button
                        style={{
                            background: 'rgb(19 60 129)',
                        }}
                        sx={{
                            height: '0',
                            color: 'white',
                            padding: "10px 19px",
                            fontSize: '13px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontFamily: 'customfont',
                            letterSpacing: '1px',
                            boxShadow: 'none',
                            marginRight: '20px',
                            marginBottom: '20px'
                        }}
                        onClick={() => props.setOpen(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
