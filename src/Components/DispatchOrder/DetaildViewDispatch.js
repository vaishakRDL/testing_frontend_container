import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { DispatchCustDelScheduleShowDetail, TodayDispatchShowDetail } from '../../ApiService/LoginPageService';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const DetaildViewDispatch = ({
    setOpen, open, setRefreshData, delNotNo
}) => {

    const [itemDetail, setItemDetail] = useState([]);

    useEffect(() => {
        if (open) {
            TodayDispatchShowDetail({
                delNo: delNotNo
            }, DispatchCustDelScheduleShowDetailSuccess, DispatchCustDelScheduleShowDetailException);
        }
    }, [open]);


    const DispatchCustDelScheduleShowDetailSuccess = (dataObject) => {
        setItemDetail(dataObject?.data || []);
    }

    const DispatchCustDelScheduleShowDetailException = (dataObject) => {

    }

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No / Part No
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Po No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fimNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                FIM No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Acpt Qty
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'type',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Type
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {

            field: 'duty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Duty
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },

        {

            field: 'stop',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Stop
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },

    ];
    const handleDownloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Dispatch Details');

        // Add Header Row
        worksheet.addRow([
            'S.No',
            'Contract No / Part No',
            'Po No',
            'FIM No',
            'Acpt Qty',
            'Type',
            'Duty',
            'Stop'
        ]);

        // Add Data Rows
        itemDetail.forEach((item, index) => {
            worksheet.addRow([
                item.sNo,
                item.contractNo,
                item.poNo,
                item.fimNo,
                item.qty,
                item.type,
                item.duty,
                item.stop
            ]);
        });

        // Style header row
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCE5FF' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Save the file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'DispatchDetails.xlsx');
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Detailed View
            </DialogTitle>
            <form >
                <DialogContent>
                    <DataGrid
                        rows={itemDetail}
                        columns={columns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none', fontWeight: 'bold' }}
                        sx={{
                            overflow: 'auto',
                            height: '60vh',
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
                            const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                console.log(' ');
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return '';
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
                        Download
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogActions>

            </form>

        </Dialog>
    )
}

export default DetaildViewDispatch
