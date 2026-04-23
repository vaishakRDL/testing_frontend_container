import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const CustomerVsItemMissing = ({ handleLoadButtonClick, missingLists, setMissingModal, missingModal, type }) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const copyColumns = [
        {
            field: 'copyFrom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Copy From</span>,
            type: 'Process Name',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'copyTo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Copy To</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'message',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Message</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        }
    ];
    const xlColumns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'Process Name',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'hsn',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>HSN Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'custDesc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer Description</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
    ];

    // const generateRowsWithIndex = (rows) => {
    //     return rows.map((row, index) => ({ id: index, ...row }));
    // };

    // const rows = generateRowsWithIndex(excelReponse);

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // const generateRowsWithIndex = (rows) => {
    //     return rows.map((row, index) => ({ id: index, ...row }));
    // };

    // const rows = generateRowsWithIndex(missingLists);

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ id: index, ...row }));
    };

    const rows = generateRowsWithIndex(missingLists);

    const onClickDownload = () => {
        if (!missingLists || missingLists.length === 0) {
            setNotification("No data available for download.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Missing Items");

        // Define columns based on table type
        const columns = type === "Import" ? xlColumns : copyColumns;

        worksheet.columns = columns.map(col => ({
            header: col.headerName.props.children, // Extracting header text from JSX
            key: col.field,
            width: 20
        }));

        // Add rows
        missingLists.forEach((row) => {
            worksheet.addRow(row);
        });

        // Style the header
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center", vertical: "middle" };
        });

        // Download the Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer]), "Missing_Items.xlsx");
        });
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg    "
            open={missingModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Missing Item Lists
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>

                    <Grid container alignItems={'center'} spacing={2} paddingTop={2.5}>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        // rows={rows}
                                        rows={generateRowsWithIndex(missingLists)}
                                        columns={type === 'Import' ? xlColumns : copyColumns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            height: '43vh',
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
                                            const rowIndex = rows.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
                                        }}

                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={onClickDownload}
                        >
                            Download
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setMissingModal(false);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default CustomerVsItemMissing