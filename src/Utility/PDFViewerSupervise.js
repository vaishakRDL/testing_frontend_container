import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { npdviewFileLink } from '../ApiService/LoginPageService';

const PDFViewerSupervise = ({ pdfOpen, setPdfOpen, fileTypeForView, selectedRowItemCode }) => {
    console.log("props.selectedRow.itemCodeprops.selectedRow.itemCode", selectedRowItemCode)

    const [fileExtension, setFileExtension] = useState('');
    const [selectedFileUrl, setSelectedFileUrl] = useState('');
    const [viewLinkData, setViewLinkData] = useState([]);
    const handleClose = () => {
        setPdfOpen(false);
        setSelectedFileUrl('');
    };

    // const baseUrl = process.env.REACT_APP_API_URL;
    // const urlParts = baseUrl.split('api/');
    // const Url = `${urlParts[0]}${fileTypeForView}`

    // useEffect(() => {
    //     setFileExtension(getFileExtension(fileTypeForView));
    // }, [fileTypeForView]);

    // const getFileExtension = (fileType) => {
    //     const segments = fileType.split('.');
    //     if (segments.length > 1) {
    //         return segments.pop().toLowerCase();
    //     }
    //     return null;
    // };

    // console.log('12212==>', Url);

    /////////////////////////////////////////

    useEffect(() => {
        pdfOpen && npdviewFileLink(
            {
                part: selectedRowItemCode,
            },
            DownloadLinkSuccess,
            DownloadLinkException
        );
    }, [pdfOpen, selectedRowItemCode])

    const DownloadLinkSuccess = (dataObject) => {
        setViewLinkData(dataObject.data || []);
    };
    const DownloadLinkException = () => {
    };

    const getFileExtension = (fileType) => {
        setSelectedFileUrl(fileType);
        const segments = fileType?.split('.');
        if (segments.length > 1) {
            const ext = segments.pop().toLowerCase();
            setFileExtension(ext);  // Update the state with the correct extension
        }
    };

    // EXTRACT FILE NAMES
    const getFileName = (url) => {
        return url ? url.split("/").pop() : "";
    };

    return (
        <div>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '100%', height: '100%' } }}
                maxWidth="xl"
                open={pdfOpen}
            >
                <DialogTitle style={{ background: '#002D68', color: 'white' }}>{`File Data View - ${selectedRowItemCode}`}</DialogTitle>
                <DialogContent>
                    {/* {fileExtension === 'pdf' ? (
                        <div style={{ width: '100%', height: '100%' }} >
                            <object style={{ height: '100%', width: '100%' }} data={Url} type="application/pdf">
                                <p>It appears you don't have a PDF plugin for this browser.
                                    No biggie... you can <a style={{ width: '100%', height: '100%' }} href={Url} target="_blank" rel="noopener noreferrer">click here to
                                        download the PDF file.</a></p>
                            </object>
                        </div>
                    ) : (
                        <img
                            srcSet={Url}
                            style={{ height: '100%', width: '100%', padding: '10px' }}
                        />
                    )
                    } */}
                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px', height: '100%' }}>
                        <div style={{ paddingTop: '10px' }}>
                            <table
                                style={{
                                    width: "80px",
                                    margin: "auto",
                                    borderCollapse: "collapse",
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                    fontFamily: "Arial, sans-serif",
                                    flex: 1,
                                }}
                            >
                                <thead>
                                    <tr style={{ backgroundColor: "#93bce6", color: "white" }}>
                                        <th style={headerCellStyle}>SNO</th>
                                        <th style={headerCellStyle}>File</th>
                                    </tr>
                                </thead>
                                {viewLinkData.length > 0 ?
                                    <tbody>
                                        {viewLinkData?.map((row, index) => (
                                            <tr key={index} style={{ backgroundColor: index % 2 ? "#f2f2f2" : "white" }}>
                                                <td style={cellStyle}>{row.sNo}</td>
                                                <td style={cellStyle} onClick={() => getFileExtension(row.file_url)}>{getFileName(row.file_url)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    :
                                    <tbody>
                                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                                            <td style={cellStyle}>--</td>
                                            <td style={cellStyles} >No image, PDF, or XLSX file was found.</td>
                                        </tr>
                                    </tbody>
                                }
                            </table>
                        </div>

                        {/* <table
                            style={{
                                width: "80%",
                                margin: "auto",
                                borderCollapse: "collapse",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                fontFamily: "Arial, sans-serif",
                                flex: 4,
                                marginTop: '10px'
                            }}
                        >
                            <tbody>
                                <tr> */}
                        <div style={{ width: '1px', backgroundColor: 'gray', height: '100%' }}></div>

                        {fileExtension ? fileExtension === 'pdf' ? (
                            <div style={{ width: '100%', height: '100%', padding: '10px' }} >
                                {/* <object style={{ height: '100%', width: '100%' }} data={selectedFileUrl} type="application/pdf">
                                    <p>It appears you don't have a PDF plugin for this browser.
                                        No biggie... you can <a style={{ width: '100%', height: '100%' }} href={selectedFileUrl} target="_blank" rel="noopener noreferrer">click here to
                                            download the PDF file.</a></p>
                                </object> */}
                                <iframe
                                    src={selectedFileUrl}
                                    width="100%"
                                    height='100%'
                                    padding='10px'
                                    style={{ border: "none" }}
                                ></iframe>
                            </div>
                        ) : fileExtension === 'xlsx' ? (
                            <a href={selectedFileUrl} style={{ width: '100%', height: '100%', padding: '10px', border: '1px solid #000000', marginTop: '10px' }} target="_blank" rel="noopener noreferrer">
                                {selectedFileUrl}
                            </a>
                        ) : (
                            <a href={selectedFileUrl}>
                                <img
                                    srcSet={selectedFileUrl}
                                    style={{ height: '100%', width: '100%', padding: '10px' }}
                                />
                            </a>
                        )
                            :
                            null
                        }
                        {/* </tr>
                            </tbody>
                        </table> */}
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

// Styles
const headerCellStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
};

const cellStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
    cursor: 'pointer',
};
const cellStyles = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
    cursor: 'pointer',
    whiteSpace: 'nowrap'
};

export default PDFViewerSupervise;