// import { WarningAmber } from '@mui/icons-material';
// import {
//     Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
// } from '@mui/material';
// import React from 'react';
// import FeedbackIcon from '@mui/icons-material/Feedback';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// export default function ApprovalConfirmation(props) {
//     function onSubmit() {
//         if (props.priceFlag === 'Price') {
//             // props.deleteService({ id: props.deleteId.id, sighn: '0', newRate: props.deleteId.newRate, supItmId: props.deleteId.supItmId }, props.handleSuccess, props.handleException);
//             const filteredArray = props.rows
//                 .filter(row => row.selected)
//                 .map(row => ({
//                     id: row.id,
//                     sighn: 0,
//                     newRate: row.newRate,
//                     supItmId: row.supItmId,
//                     itemId: row.itemId,
//                     remarks: ''
//                 }));
//             props.deleteService({ items: filteredArray }, props.handleSuccess, props.handleException);
//         } else {
//             props.deleteService({ id: props.deleteId, status: '1' }, props.handleSuccess, props.handleException);
//         }
//     }
//     return (
//         <Dialog
//             fullWidth
//             maxWidth="sm"
//             sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
//             open={props.open}
//         >
//             <DialogTitle sx={{ textAlign: 'center' }}>
//                 <CheckCircleIcon color="#65B741" style={{ fontSize: 95, color: '#65B741' }} />
//             </DialogTitle>
//             <DialogContent sx={{
//                 mt: 1,
//                 textAlign: 'center', fontFamily: 'customfont',
//                 letterSpacing: '0.5px',
//                 marginTop: '0px'
//             }}>
//                 <Typography
//                     sx={{
//                         m: 1,
//                         fontFamily: 'customfont',
//                         letterSpacing: '0.5px',
//                         padding: '10px 0'
//                     }}
//                     variant="h5"
//                     component="span"
//                 >
//                     Confirm Action
//                 </Typography>
//                 <br />
//                 This process cannot be undone.
//             </DialogContent>
//             <DialogActions sx={{ margin: '10px' }}>
//                 <div style={{ textAlign: 'center', marginBottom: '20px' }}>
//                     <Button onClick={() => { onSubmit(); }}
//                         style={{
//                             background: 'rgb(19 60 129)',
//                         }}
//                         sx={{
//                             height: '0',
//                             color: 'white',
//                             padding: "10px 19px",
//                             fontSize: '13px',
//                             borderRadius: '10px',
//                             fontWeight: '600',
//                             fontFamily: 'customfont',
//                             letterSpacing: '1px',
//                             boxShadow: 'none',
//                             marginRight: '20px',
//                             marginBottom: '20px'
//                         }}>
//                         Confirm
//                     </Button>
//                     <Button
//                         style={{
//                             background: 'rgb(19 60 129)',
//                         }}
//                         sx={{
//                             height: '0',
//                             color: 'white',
//                             padding: "10px 19px",
//                             fontSize: '13px',
//                             borderRadius: '10px',
//                             fontWeight: '600',
//                             fontFamily: 'customfont',
//                             letterSpacing: '1px',
//                             boxShadow: 'none',
//                             marginRight: '20px',
//                             marginBottom: '20px'
//                         }}
//                         onClick={() => props.setOpen(false)}
//                     >
//                         Cancel
//                     </Button>
//                 </div>
//             </DialogActions>
//         </Dialog>
//     );
// }
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ApprovalConfirmation(props) {

    const [showPasswordField, setShowPasswordField] = useState(false);
    const [password, setPassword] = useState('');

    const handleConfirmClick = () => {
        setShowPasswordField(true);
    };

    const resetDialog = () => {
        setPassword('');
        setShowPasswordField(false);
        props.setOpen(false);
    };

    const onSubmit = () => {
        if (!password) {
            alert('Please enter password');
            return;
        }

        if (props.priceFlag === 'Price') {
            const filteredArray = props.rows
                .filter(row => row.selected)
                .map(row => ({
                    id: row.id,
                    sighn: 0,
                    newRate: row.newRate,
                    supItmId: row.supItmId,
                    itemId: row.itemId,
                    remarks: '',
                }));

            props.deleteService(
                {
                    items: filteredArray,
                    dept: "Purchase",
                    module: "priceRevisionApproval",
                    pass: password,   // 🔐 password added
                },
                handleSuccess,
                handleException
            );
        } else {
            props.deleteService(
                {
                    id: props.deleteId,
                    status: '1',
                    dept: "Purchase",
                    module: "priceRevisionApproval",
                    pass: password,   // 🔐 password added
                },
                handleSuccess,
                handleException
            );
        }
    };

    const handleSuccess = (res) => {
        resetDialog();
        props.handleSuccess(res);
    };

    const handleException = (err) => {
        resetDialog();
        props.handleException(err);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={props.open}
            sx={{ '& .MuiDialog-paper': { width: '80%' } }}
        >
            <DialogTitle sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 90, color: '#65B741' }} />
            </DialogTitle>

            <DialogContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Confirm Action
                </Typography>

                <Typography sx={{ mb: 2 }}>
                    This process cannot be undone.
                </Typography>

                {/* 🔐 Password Field */}
                {showPasswordField && (
                    <TextField
                        type="password"
                        label="Enter Password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', mb: 2 }}>
                {!showPasswordField ? (
                    <Button
                        onClick={handleConfirmClick}
                        sx={buttonStyle}
                    >
                        Confirm
                    </Button>
                ) : (
                    <Button
                        onClick={onSubmit}
                        sx={buttonStyle}
                    >
                        Submit Approval
                    </Button>
                )}

                <Button
                    // onClick={() => {
                    //     props.setOpen(false);
                    //     setPassword('')
                    //     setShowPasswordField(false)
                    // }}
                    onClick={resetDialog}
                    sx={buttonStyle}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const buttonStyle = {
    background: 'rgb(19 60 129)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: '600',
    letterSpacing: '1px',
    boxShadow: 'none',
    '&:hover': {
        background: 'rgb(15 50 110)',
    },
};
