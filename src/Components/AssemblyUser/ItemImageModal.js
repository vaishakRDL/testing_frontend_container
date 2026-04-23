import {
    Button, Grid, Dialog, DialogContent, DialogTitle, TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import { GetAssemblyImage } from '../../ApiService/LoginPageService';
// import NotificationBar from '../../../../../Utility/NotificationBar';
const ItemImageModal = (props) => {
    const { setImageModal, imageModal, selectedItemCode } = props;
    const [imageData, setImageData] = useState([]);

    useEffect(() => {
        imageModal && GetAssemblyImage({ part: selectedItemCode }, handleSuccess, handleException)
    }, [imageModal])

    const handleSuccess = (dataObject) => {
        setImageData(dataObject?.data || [])
    }
    const handleException = () => { }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
            open={imageModal}
        >
            <form >
                <DialogTitle>
                    {`${selectedItemCode}`}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{ marginTop: '10px', padding: '15px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>S.No</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>File URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {imageData && imageData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">{item.file_url}</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ margin: '10px' }}>
                    <Button
                        size="large"
                        autoFocus
                        onClick={() => {
                            setImageModal(false)
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form >
            {/* <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            /> */}
        </Dialog >
    );
}
export default ItemImageModal;