
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const JobWorkWithoutPoModal = (props) => {
    const { WithoutsetJobWorkReceiptModal,
        WithoutjobWorkReceiptModal,
        WithoutsetJobWorkReceipt,
        WithoutsupplierId,
        WithoutbillingAddress,
        WithoutsupplierSelect,
        WithoutsupplierInvoiceNoCopy,
        WithoutsupplierInvoiceDateCopy,
        WithoutcSupplierDcNoCopy,
        WithoutsupplierDcDateCopy
    } = props;
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo", WithoutsupplierInvoiceNoCopy)
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo", WithoutsupplierInvoiceDateCopy)
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo", WithoutcSupplierDcNoCopy)
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo", WithoutsupplierDcDateCopy)

    const navigate = useNavigate();

    const handleClose = () => {
        WithoutsetJobWorkReceiptModal(false);
        WithoutsetJobWorkReceipt(false);
    };

    //     const handleOk = () => {
    //         WithoutsetJobWorkReceipt(false);
    //         WithoutsetJobWorkReceiptModal(false);
    //         // navigate(`/JobworkReceiptModule?selectedSuppName=${WithoutsupplierSelect}&&selectedSpAddress=${WithoutbillingAddress}&&selectedsupId=${WithoutsupplierId}&&supplierInvoiceNoCopy=${WithoutsupplierInvoiceNoCopy}&&supplierInvoiceDateCopy=${WithoutsupplierInvoiceDateCopy}&&cSupplierDcNoCopy=${WithoutcSupplierDcNoCopy}&&supplierDcDateCopy=${WithoutsupplierDcDateCopy}`);
    //         // navigate(`/JobworkReceiptModule?mode=withoutPO&selectedSuppName=${WithoutsupplierSelect}&selectedSpAddress=${WithoutbillingAddress}&withoutPOSupplierId=${WithoutsupplierId}&supplierInvoiceNoCopy=${WithoutsupplierInvoiceNoCopy}&supplierInvoiceDateCopy=${WithoutsupplierInvoiceDateCopy}&cSupplierDcNoCopy=${WithoutcSupplierDcNoCopy}&supplierDcDateCopy=${WithoutsupplierDcDateCopy}`);
    //  navigate(
    //     `/JobworkReceiptModule
    //       ?mode=withoutPO
    //       &selectedSuppName=${WithoutsupplierSelect}
    //       &selectedSpAddress=${WithoutbillingAddress}
    //       &withoutPOSupplierId=${WithoutsupplierId}
    //       &supplierInvoiceNoCopy=${WithoutsupplierInvoiceNoCopy}
    //       &supplierInvoiceDateCopy=${WithoutsupplierInvoiceDateCopy}
    //       &cSupplierDcNoCopy=${WithoutcSupplierDcNoCopy}
    //       &supplierDcDateCopy=${WithoutsupplierDcDateCopy}`
    //       .replace(/\s+/g, "") // removes newlines/spaces
    //   );
    //     }

    const handleOk = () => {
        WithoutsetJobWorkReceipt(false);
        WithoutsetJobWorkReceiptModal(false);

        // Encode the address to safely include #, spaces, commas, etc.
        const encodedAddress = encodeURIComponent(WithoutbillingAddress);

        navigate(
            `/JobworkReceiptModule?mode=withoutPO
        &selectedSuppName=${WithoutsupplierSelect}
        &selectedSpAddress=${encodedAddress}
        &withoutPOSupplierId=${WithoutsupplierId}
        &supplierInvoiceNoCopy=${WithoutsupplierInvoiceNoCopy}
        &supplierInvoiceDateCopy=${WithoutsupplierInvoiceDateCopy}
        &cSupplierDcNoCopy=${WithoutcSupplierDcNoCopy}
        &supplierDcDateCopy=${WithoutsupplierDcDateCopy}`
                .replace(/\s+/g, "") // remove newlines/spaces
        );
    };

    return (
        <React.Fragment>
            <Dialog
                open={WithoutjobWorkReceiptModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ color: '#000000', fontWeight: 'bold' }}>
                    Purchase Bill Without PO
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ color: '#000000' }}>
                        Do you want you to make Job Work Receipt...?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleOk} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
export default JobWorkWithoutPoModal;