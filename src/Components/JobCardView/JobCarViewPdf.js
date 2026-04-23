import React, { useState } from 'react';
// import { DownloadAuditSummaryAssetPdf, PdfEmailSend } from '../../../services/ApiServices';
import jsPDF from 'jspdf';
import { styled } from '@mui/material/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        width: '100%',
        maxWidth: 'none',
        overflowY: 'hidden',
    },
}));

const JobCarViewPdf = () => {
    const [pdfEmail, setPdfEmail] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfExistAsset, setPdfExistAsset] = useState([]);
    const [pdfMissingAsset, setPdfMissingAsset] = useState([]);
    const [pdfNewAsset, setPdfNewAsset] = useState([]);
    const [pdfAssetDetails, setPdfAssetDetails] = useState([]);
    const [pdfAssetCount, setPdfAssetCount] = useState([]);
    const [openEnterSend, setEnterSendOpen] = useState(false);
    const [email1, setEmail1] = useState('');
    const [email2, setEmail2] = useState('');
    const [loading, setLoading] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: ''
    });
    const [open, setOpen] = useState(true);

    const editData = {
        auditId: "123456789", // Example audit ID
        auditDate: "2024-03-22", // Example audit date
        auditor: "John Doe", // Example auditor name
        // Example data for existing assets
        existingAssets: [
            {
                serial_number: 1,
                component: "Component A",
                assetNo: "A001",
                assetName: "Asset A",
                usagecode: "Code 1",
                physicalPresense: "Yes",
                numberIndication: "Yes",
                assetPlateIndication: "Yes",
            },
            // Add more existing assets as needed
        ],
        // Example data for pending assets
        pendingAssets: [
            {
                serial_number: 1,
                component: "Component B",
                assetNo: "B001",
                assetName: "Asset B",
                usagecode: "Code 2",
                // Add other properties as needed
            },
            // Add more pending assets as needed
        ],
        // Example data for additional added assets
        additionalAssets: [
            {
                serial_number: 1,
                lineName: "Line 1",
                assetNo: "C001",
                assetName: "Asset C",
                usagecode: "Code 3",
                usedOrNew: "New",
                physicalPresense: "Yes",
                numberIndication: "Yes",
                assetPlateIndication: "Yes",
                foundLineId: "Line 2",
                unitName: "Unit 1",
                equipmentType: "Type A",
                // Add other properties as needed
            },
            // Add more additional assets as needed
        ],
    };

    const handleClickOpen = () => {
        setEnterSendOpen(true);
    };

    const handleEnterSendClose = () => {
        setEnterSendOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNotificationClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const PdfGenerate = () => {
        // DownloadAuditSummaryAssetPdf(editData.auditId, handleDownloadExisting, handleDownloadExistingException);
    };

    const handleDownloadExisting = (dataObject) => {
        setPdfExistAsset(dataObject.ExistAsset);
        setPdfMissingAsset(dataObject.missingAsset);
        setPdfNewAsset(dataObject.newAsset);
        setPdfAssetDetails(dataObject.ule);
        setPdfAssetCount(dataObject.assetCount);
        generatePdf(pdfExistAsset, pdfMissingAsset, pdfNewAsset, pdfAssetDetails, pdfAssetCount);
    };

    const handleDownloadExistingException = () => {};

    const generatePdf = (pdfExistAsset, pdfMissingAsset, pdfNewAsset, pdfAssetDetails, pdfAssetCount) => {

        const doc = new jsPDF('landscape');
        doc.setFontSize(8); // Set font size to 10
        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('UNIT/PLANT', 5, 10);
        doc.text('LINE', 5, 15);
        doc.text('EQUIPMENT TYPE', 5, 20);
        doc.text('AUDITED DATE', 5, 25);
        doc.setFont('helvetica', 'normal');

        Object.values(pdfAssetDetails[0]).forEach((value, index) => {
            doc.text(`${value}`, 35, 10 + index * 5);
        });

        doc.setFontSize(8); // Set font size to 10
        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('TOTAL AUDIT PLANNED ASSETS', 80, 10);
        doc.text('ACTUAL AUDITED ASSET', 80, 15);
        doc.text('MISSED / NOT SCANNED ASSETSE', 80, 20);
        doc.text('ADDITIONAL ASSETS', 80, 25);
        doc.text('TOTAL AUDITED / SCANASSETS', 80, 30);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${pdfAssetCount}`, 140, 10);
        const existAssetCount = pdfExistAsset.length;
        doc.text(`${existAssetCount}`, 140, 15);
        const missingAsset = pdfMissingAsset.length;
        doc.text(`${missingAsset}`, 140, 20);
        const newAsset = pdfNewAsset.length;
        doc.text(`${newAsset}`, 140, 25);
        const totalAudited = existAssetCount + newAsset;
        doc.text(`${totalAudited}`, 140, 30);

        doc.setFontSize(8); // Set font size to 10
        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('NO OFF YES', 160, 10);
        doc.text('NO OFF NO', 160, 15);

        doc.setFontSize(8); // Set font size to 10
        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('SIGNATURE OF CONFIRMER', 200, 10);

        doc.setFontSize(8); // Set font size to 10
        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('ASSETS LIST', 150, 50);

        doc.setFontSize(7); // Set font size to 10
        doc.setFont('helvetica', 'bold'); // Set font to bold




        // // Define starting coordinates for header row
        let headerX = 5;
        let headerY = 60;

        const headerCells = ['SL NO', 'COMPONENT', 'ASSET NO', 'MACHINE NAME', 'USAGE CODE', 'PHYSICAL PRESENCE', 'NUMBER INDICATION', 'ASSET PLATE INDICATION', 'REMARK & SIGN IN CASE OF DEVIATION'];

        // Define the desired widths for each header cell
        const headerCellWidths = [10, 30, 30, 40, 25, 35, 35, 35, 60];

        // Write the header row using the text method
        headerCells.forEach((cell, index) => {
            doc.text(cell, headerX, headerY);
            headerX += headerCellWidths[index];
        });



        let dataX = 5;
        let dataY = 60;

        // Loop through each item in the data array
        pdfExistAsset.forEach((item, index) => {


            if (dataY + 10 >= doc.internal.pageSize.height - 10) {
                // 5, 10
                doc.addPage(); // Add a new page if there is not enough space
                // generateHeader(); // Regenerate the header on the new page
                dataY = 10; // Reset the y coordinate for the new page
                dataX = 5; // Reset the x coordinate for the new page
            }



            // Increment the y coordinate for each row of data
            dataY += 10;
            // Reset the x coordinate for each row of data
            dataX = 5;
            // Write the data to each cell using the text method
            doc.text(String(item.serial_number), dataX, dataY);
            dataX += 10;
            doc.text(item.component, dataX, dataY);
            dataX += 30;
            doc.text(item.assetNo, dataX, dataY);
            dataX += 30;
            doc.text(item.assetName, dataX, dataY);
            dataX += 40;
            doc.text(item.usagecode, dataX, dataY);
            dataX += 25;
            doc.text(item.physicalPresense, dataX, dataY);
            dataX += 35;
            doc.text(item.numberIndication, dataX, dataY);
            dataX += 35;
            doc.text(item.assetPlateIndication, dataX, dataY);
            dataX += 35;
        });


        // // Define starting coordinates for the missing asset table
        let missingX = 5;
        let missingY = dataY + 30; // Start below the existing table


        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('MISSING ASSETS', 150, dataY + 15);

        const MissingHeaderCells = ['SL NO', 'COMPONENT', 'ASSET NO', 'MACHINE NAME', 'USAGE CODE', 'PHYSICAL PRESENCE', 'NUMBER INDICATION', 'ASSET PLATE INDICATION', 'REMARK & SIGN IN CASE OF DEVIATION'];

        const headerMissingCellWidths = [10, 30, 30, 40, 25, 35, 35, 35, 60];


        // Write the header row for the missing asset table
        MissingHeaderCells.forEach((cell, index) => {
            doc.text(cell, missingX, missingY);
            missingX += headerMissingCellWidths[index];
        });



        // Loop through each item in the pdfMissingAsset array and write the data to the table
        pdfMissingAsset.forEach((item, index) => {
            if (missingY + 10 >= doc.internal.pageSize.height - 10) {
                // 5, 10
                doc.addPage(); // Add a new page if there is not enough space
                // generateHeader(); // Regenerate the header on the new page
                missingY = 10; // Reset the y coordinate for the new page
                missingX = 5; // Reset the x coordinate for the new page
            }



            missingY += 10; // Increment the y coordinate for each row of data
            missingX = 5; // Reset the x coordinate for each row of data
            doc.text(String(item.serial_number), missingX, missingY);
            missingX += 10;
            doc.text(item.component, missingX, missingY);
            missingX += 30;
            doc.text(item.assetNo, missingX, missingY);
            missingX += 30;
            doc.text(item.assetName, missingX, missingY);
            missingX += 40;
            doc.text(item.usagecode, missingX, missingY);
            missingX += 25;
            // doc.text(item.physicalPresense, missingX, missingY);
            // missingX += 35;
            // doc.text(item.numberIndication, missingX, missingY);
            // missingX += 35;
            // doc.text(item.assetPlateIndication, missingX, missingY);
            // missingX += 35;
        });

        // New Asset List
        let newX = 5;
        let newY = missingY + 30; // Start below the missing asset table

        doc.setFont('helvetica', 'bold'); // Set font to bold
        doc.text('ADDITIONAL ADDED ASSETS', 150, missingY + 15);

        const NewHeaderCells = ['SL NO', 'LINE', 'ASSET NO', 'MACHINE NAME', 'USAGE CODE', 'USED/NEW', 'PHYS.PRES', 'NUM INDICAT', 'ASSET PLATE', 'PREVIOUS LINE', 'PLANT', 'EQP TYPE', 'REMARK & SIGN IN CASE OF DEVIATION'];
        const headerNewCellWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

        // Write the header row for the missing asset table
        NewHeaderCells.forEach((cell, index) => {
            doc.text(cell, newX, newY);
            newX += headerNewCellWidths[index];
        });

        // Loop through each item in the pdfNewAsset array and write the data to the table
        pdfNewAsset.forEach((item, index) => {

            if (newY + 10 >= doc.internal.pageSize.height - 10) {
                // 5, 10
                doc.addPage(); // Add a new page if there is not enough space
                // generateHeader(); // Regenerate the header on the new page
                newY = 10; // Reset the y coordinate for the new page
                newX = 5; // Reset the x coordinate for the new page
            }



            newY += 10; // Increment the y coordinate for each row of data
            newX = 5; // Reset the x coordinate for each row of data

            doc.text(String(item.serial_number), newX, newY);
            newX += 10;

            doc.text(item.lineName, newX, newY);
            newX += 25;

            doc.text(item.assetNo, newX, newY);
            newX += 20;

            doc.text(item.assetName, newX, newY);
            newX += 25;

            doc.text(item.usagecode, newX, newY);
            newX += 30;

            doc.text(item.usedOrNew, newX, newY);
            newX += 20;

            doc.text(item.physicalPresense, newX, newY);
            newX += 20;

            doc.text(item.numberIndication, newX, newY);
            newX += 20;

            doc.text(item.assetPlateIndication, newX, newY);
            newX += 20;

            doc.text(item.foundLineId, newX, newY);
            newX += 20;

            doc.text(item.unitName, newX, newY);
            newX += 20;

            doc.text(item.equipmentType, newX, newY);
            newX += 20;
        });

        const pdfData = doc.output('blob');
        setPdfUrl(URL.createObjectURL(pdfData));
        setOpen(true);
        // setPdfEmail(URL.createObjectURL(pdfData))

        // Convert the Blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result;

            // Use the base64 data as needed (e.g., send it in an API request, display it in an iframe, etc.)
            setPdfEmail(base64Data);
        };
        reader.readAsDataURL(pdfData);
    };

    const PdfSend = () => {
        // setLoading(true);
        // PdfEmailSend({ pdf: pdfEmail, auditId: editData.auditId }, handlePdfEmailSendSuccess, handlePdfEmailSendException);
    };

    const handlePdfEmailSendSuccess = (dataObject) => {
        setLoading(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        handleEnterSendClose();
        setEmail1('');
        setEmail2('');
    };

    const handlePdfEmailSendException = (errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleNotificationClose();
        }, 3000);
        setLoading(false);
    };

    return (
        <div>
            {/* Your JSX layout */}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogContent dividers>
                    {pdfUrl && <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={PdfSend} disabled={loading} endIcon={<SendIcon />}>
                        {loading ? "Sending..." : "Send"}
                    </Button>
                    <Button autoFocus onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleNotificationClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />
            </BootstrapDialog>
        </div>
    );
};

export default JobCarViewPdf;

