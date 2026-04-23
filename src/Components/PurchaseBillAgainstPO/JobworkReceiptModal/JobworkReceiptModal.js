import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const JobworkReceiptModal = (props) => {
    const { setJobWorkReceiptModal,
        jobWorkReceiptModal,
        setJobWorkReceipt,
        supplierId,
        billingAddress,
        supplierSelect,
        supplierInvoiceNoCopy,
        supplierInvoiceDateCopy,
        cSupplierDcNoCopy,
        supplierDcDateCopy,
        genPoBillFlag
    } = props;
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooosupplierInvoiceNoCopy", supplierInvoiceNoCopy)
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooosupplierInvoiceDateCopy", supplierInvoiceDateCopy)
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooo", cSupplierDcNoCopy)
    console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooooos1233344Supllierifd", supplierId)

    const navigate = useNavigate();

    const handleClose = () => {
        setJobWorkReceiptModal(false);
        setJobWorkReceipt(false);
    };

    // const handleOk = () => {
    //     setJobWorkReceipt(false);
    //     setJobWorkReceiptModal(false);
    //     // navigate(`/JobworkReceiptModule?selectedSuppName=${supplierSelect}&&selectedSpAddress=${billingAddress}&&selectedsupId=${supplierId}&&supplierInvoiceNoCopy=${supplierInvoiceNoCopy}&&supplierInvoiceDateCopy=${supplierInvoiceDateCopy}&&cSupplierDcNoCopy=${cSupplierDcNoCopy}&&supplierDcDateCopy=${supplierDcDateCopy}`);
    //     // if (genPoBillFlag) {
    //         navigate(`/JobworkReceiptModule?mode=withPO&selectedSuppName=${supplierSelect}&selectedSpAddress=${billingAddress}&withPOSupplierId=${supplierId}&supplierInvoiceNoCopy=${supplierInvoiceNoCopy}&supplierInvoiceDateCopy=${supplierInvoiceDateCopy}&cSupplierDcNoCopy=${cSupplierDcNoCopy}&supplierDcDateCopy=${supplierDcDateCopy}`);
    //     // } 
    // }
    const handleOk = () => {
  setJobWorkReceipt(false);
  setJobWorkReceiptModal(false);

  const encodedSuppName = encodeURIComponent(supplierSelect || "");
  const encodedBillingAddress = encodeURIComponent(billingAddress || "");
  const encodedInvoiceNo = encodeURIComponent(supplierInvoiceNoCopy || "");
  const encodedInvoiceDate = encodeURIComponent(supplierInvoiceDateCopy || "");
  const encodedDcNo = encodeURIComponent(cSupplierDcNoCopy || "");
  const encodedDcDate = encodeURIComponent(supplierDcDateCopy || "");

  navigate(
    `/JobworkReceiptModule?mode=withPO` +
    `&selectedSuppName=${encodedSuppName}` +
    `&selectedSpAddress=${encodedBillingAddress}` +
    `&withPOSupplierId=${supplierId}` +
    `&supplierInvoiceNoCopy=${encodedInvoiceNo}` +
    `&supplierInvoiceDateCopy=${encodedInvoiceDate}` +
    `&cSupplierDcNoCopy=${encodedDcNo}` +
    `&supplierDcDateCopy=${encodedDcDate}`
  );
};


    return (
        <React.Fragment>
            <Dialog
                open={jobWorkReceiptModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ color: '#000000', fontWeight: 'bold' }}>
                    Purchase Bill Against PO
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
export default JobworkReceiptModal;