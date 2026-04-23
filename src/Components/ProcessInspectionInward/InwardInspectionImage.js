import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'

const InwardInspectionImage = ({ openImg, setOpenImg, isSelectedData }) => {
    const [fileExtension, setFileExtension] = useState('')
    const handleClose = () => {
        setOpenImg(false);
    };

    const baseUrl = process.env.REACT_APP_API_URL;
    const urlParts = baseUrl.split('api/');
    const Url = `${urlParts[0]}${isSelectedData?.npdFile}`
    console.log("UrlUrl", Url)

    useEffect(() => {

    }, []);

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', height: '100%' } }}
            maxWidth="xl"
            open={openImg}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>Process Inspection Image</DialogTitle>
            <DialogContent>

                <img
                    srcSet={Url}
                    style={{ height: '100%', width: '100%', padding: '10px' }}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default InwardInspectionImage
