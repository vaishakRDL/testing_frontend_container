import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, CardActionArea,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { ItemDownloadExlExport } from '../../../ApiService/DownloadCsvReportsService';
import { DataGrid } from '@mui/x-data-grid';
import { ItemImportExcel } from '../../../ApiService/LoginPageService';
import ApplicationStore from '../../../Utility/localStorageUtil';
import ClearIcon from '@mui/icons-material/Clear';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const RemoveErroneous = ({
    open, setOpen, setIsError }) => {

    const [dataReviewSet, setDataReviewSet] = useState([]);
    const [resfreshData, setRefreshData] = useState(false)
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    useEffect(() => {

        if (open) {
            const tempDataList = ApplicationStore().getStorage2('ErrorArrayList');
            setDataReviewSet(tempDataList || []);
        }
    }, [open, resfreshData]);

    const handleSubmit = () => {

    }

    const RemoveAllData = () => {
        setRefreshData((oldValue) => !oldValue);
        setIsError(true);
        ApplicationStore().clearStorage2('');
    };

    const columns = [
        {
            field: 'rowNumber',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Row Number
                </span>,
            type: 'string',
            sortable: true,
            maxWidth: 150, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'message',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Message
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 250,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'partNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part Number
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 250,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            maxWidth: 150,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Remove All
                    <ClearIcon
                        onClick={RemoveAllData}
                    />
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <SelectAction selectedRow={params.row} />,
            ],
        },
    ];


    function SelectAction(props) {

        const onSelectedItem = () => {
            const tempArray = dataReviewSet.filter((item) => item?.id !== props?.selectedRow?.id);
            setDataReviewSet(tempArray);
            ApplicationStore().setStorage2("ErrorArrayList", tempArray);
            if (tempArray.length <= 0) {
                setIsError(true);
            }
        }

        return (
            <div style={{ display: 'flex' }}>
                <ClearIcon
                    // checked={props?.selectedRow === 1}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }

    // const handleDownloadExcel = () => {
    //     if (dataReviewSet.length === 0) {
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: 'No data available to download!',
    //         });
    //         return;
    //     }

    //     // Create a new worksheet from the data
    //     const worksheet = XLSX.utils.json_to_sheet(dataReviewSet);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Error Data");

    //     // Convert the workbook to a Blob
    //     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    //     // Save the file
    //     saveAs(data, "Error_Data.xlsx");

    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: 'Excel file downloaded successfully!',
    //     });
    // };



    const handleDownloadExcel = async () => {
        if (dataReviewSet.length === 0) {
            setNotification({
                status: true,
                type: 'error',
                message: 'No data available to download!',
            });
            return;
        }

        // Remove "id" from the exported data
        const formattedData = dataReviewSet.map(({ id, ...rest }) => rest);

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Error Data');

        // Get headers dynamically
        // const headers = Object.keys(formattedData[0]);
        const headers = ['Row Number', 'Part No', 'Error'];

        // Add headers row
        worksheet.addRow(headers);

        // Apply styles to headers (bold + centered)
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true }; // Bold text
            cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Center alignment
        });

        // Add data rows
        formattedData.forEach((item) => {
            worksheet.addRow(Object.values(item));
        });

        // Auto-fit columns
        worksheet.columns.forEach((column) => {
            column.width = column.header ? column.header.length + 5 : 15;
        });

        // Write the workbook to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Save the file
        const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, 'Error_Data.xlsx');

        setNotification({
            status: true,
            type: 'success',
            message: 'Excel file downloaded successfully!',
        });
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Remove erroneous records
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <DataGrid
                        rows={dataReviewSet}
                        columns={columns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none', }}
                        sx={{
                            overflow: 'auto',
                            height: '55vh',
                            // minHeight: '500px',
                            width: '100%',
                            '& .super-app-theme--header': {
                                WebkitTextStrokeWidth: '0.6px',
                                backgroundColor: '#93bce6',
                                color: '#1c1919'

                            },
                            '& .MuiDataGrid-cell': {
                                border: '1px solid #969696',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                border: '1px solid #969696', // Add border to column headers
                            },
                        }}
                        getRowClassName={(params) => {
                            // Find the index of the row within the rows array
                            const rowIndex = dataReviewSet.findIndex(row => row.id === params.row.id);
                            // Check if the index is valid
                            if (rowIndex !== -1) {
                                console.log(' ');
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return ''; // Return default class if index is not found
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={handleDownloadExcel}

                    >
                        Downlaod Excel
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </form>
        </Dialog>
    )
}

export default RemoveErroneous