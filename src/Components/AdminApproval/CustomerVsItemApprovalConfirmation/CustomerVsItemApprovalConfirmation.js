import { WarningAmber } from '@mui/icons-material';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import React from 'react';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CustomerVsItemApprovalConfirmation(props) {
    // function onSubmit() {
    //     if (props.priceFlag === 'Price') {
    //         // props.deleteService({ id: props.deleteId.id, sighn: '0', newRate: props.deleteId.newRate, supItmId: props.deleteId.supItmId }, props.handleSuccess, props.handleException);
    //         const filteredArray = props.rows
    //             .filter(row => row.selected)
    //             .map(row => ({
    //                 id: row.id,
    //                 // sighn: 0,
    //                 new_rate: row.new_rate,
    //                 custItemId: row.custItemId,
    //                 // remarks: ''
    //             }));
    //         props.deleteService({ data: filteredArray }, props.handleSuccess, props.handleException);
    //     } else {
    //         props.deleteService({ id: props.deleteId, status: '1' }, props.handleSuccess, props.handleException);
    //     }
    // }
    function onSubmit() {
    if (props.priceFlag === 'Price') {
        // Map the selected rows directly
        const filteredArray = props.rows.map(row => ({
            id: row.id,
            new_rate: row.new_rate,
            custItemId: row.custItemId,
        }));

        if (filteredArray.length === 0) {
            alert("Please select at least one row!");
            return;
        }

        props.deleteService({ data: filteredArray }, props.handleSuccess, props.handleException);
    } else {
        props.deleteService({ id: props.deleteId, status: '1' }, props.handleSuccess, props.handleException);
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
                <CheckCircleIcon color="#65B741" style={{ fontSize: 95, color: '#65B741' }} />
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
