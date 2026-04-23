import { Palette } from "@mui/icons-material";
const CompliteSucess = (scannedStatus) => {
    switch (scannedStatus) {
        case 'Pending':
            // jobStatusColor(error);
            return 'info';
            break;
        case 'Completed':
            // jobStatusColor(success);
            return 'secondary';
            break;
        case 'In Process':
            // jobStatusColor(warning);
            return 'info';
            break;
        case 'Fullfilled':
            return 'primary';
            break;
        case 'Approved':
            return 'success';
            break;
        case 'Rejected':
            return 'error';
            break;
        case 'Partially Completed':
            return 'warning';
            break;
        default: break;
    }
}
export default CompliteSucess;