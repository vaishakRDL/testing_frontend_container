import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const CustomerFileOpen = ({ pdfOpen, setPdfOpen, fileTypeForView,saved }) => {

    const [fileExtension, setFileExtension] = useState('')
    const handleClose = () => {
        setPdfOpen(false);
    };

    const baseUrl = process.env.REACT_APP_API_URL;
    const urlParts = baseUrl.split('api/');
    const Url = saved===1?`${urlParts[0]}${fileTypeForView}`:fileTypeForView

    const getFileExtension = (fileType) => {
        const segments = fileType.split('.');
        if (segments.length > 1) {
            return segments.pop().toLowerCase();
        }
        return null;
    };

    console.log('12212==>', Url);

    return (
        <div>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '100%', height: '100%' } }}
                maxWidth="xl"
                open={pdfOpen}
            >
                <DialogTitle style={{ background: '#002D68', color: 'white' }}>File Data View</DialogTitle>
                <DialogContent>
                    {/* {fileExtension === 'pdf' ? ( */}
                        <div style={{ width: '100%', height: '100%' }} >
                            <object style={{ height: '100%', width: '100%' }} data={Url} type="application/pdf">
                                <p>It appears you don't have a PDF plugin for this browser.
                                    No biggie... you can <a style={{ width: '100%', height: '100%' }} href={Url} target="_blank" rel="noopener noreferrer">click here to
                                        download the PDF file.</a></p>
                            </object>
                        </div>
                    {/* ) : (
                        <img
                            srcSet={Url}
                            style={{ height: '100%', width: '100%', padding: '10px' }}
                        />
                    )
                    } */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CustomerFileOpen;