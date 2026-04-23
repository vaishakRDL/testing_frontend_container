import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export default function CustomePopUp(props) {

    const {
        customeOpen,
        setCustomeOpen,
        title,
        titleColor,
        message,
        messageColor,
        CustomIcon,
        iconColor,
        confirmButtonTitle,
        closeButtonTitle,
        confirmButtonBackGround,
        confirmButtonTextColor,
        closeButtonBackground,
        closeButtonTextColor,
        handleCustomeSuccess,
        handleCustomeFailure,
        customeServicesApi,
        bodyData,
        viewButton = false,
        setViewButton = null
    } = props;

    const handleSubmit = () => {
        if (typeof setViewButton === 'function') {
            setViewButton(true);
        }
        customeServicesApi(bodyData, handleCustomeSuccess, handleCustomeFailure)
    }

    const handleClose = () => {
        setCustomeOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={customeOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ color: titleColor, textAlign: 'center', fontWeight: 'bold', fontSize: '22px' }}>
                    {title}
                </DialogTitle>
                <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CustomIcon color="warning" style={{ fontSize: 95, color: iconColor }} />
                    <DialogContentText id="alert-dialog-description" style={{ color: messageColor }}>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button onClick={handleSubmit} disabled={viewButton} style={{ backgroundColor: confirmButtonBackGround, color: confirmButtonTextColor }}>
                        {confirmButtonTitle}
                    </Button>
                    <Button onClick={handleClose} style={{ backgroundColor: closeButtonBackground, color: closeButtonTextColor }}>
                        {closeButtonTitle}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}