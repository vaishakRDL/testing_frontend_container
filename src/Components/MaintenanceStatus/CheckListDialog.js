import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import { DataGrid } from '@mui/x-data-grid';
import { ChecklistToolList } from '../../ApiService/LoginPageService';
import VerifyModal from '../Checklist/VerifyModal';

const CheckListDialog = (props) => {
    const { openCheckList, setOpenCheckList, machineTag, checkListId, rowMaintId, setRowMaintId, ...other } = props;
    console.log("checkListId", checkListId)
    const [checklistShow, setChecklistShow] = useState([]);
    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState('');
    const [currentFrequency, setCurrentFrequency] = useState('');
    const [selectedRowData, setSelectedRowData] = useState({});
    const [calenderDate, setCalenderDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const columns = [
        {
            field: 'checklist_name',
            headerName: 'Checklist Name',
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },

        {
            field: 'description',
            headerName: 'Checklist Description',
            type: 'string',
            sortable: true,
            minWidth: 200,
            flex: 1.5,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'document_version',
            headerName: 'Document Version',
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'template_name',
            headerName: 'Template Name',
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            align: 'center',
            headerAlign: 'center',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <ViewAction selectedRow={params.row} />,
            ],
        },
    ];

    function ViewAction(props) {
        return (
            <Button
                variant="outlined"
                size="small"
                sx={{ fontWeight: 'bold', color: '#004286', borderColor: '#004286', '&:hover': { backgroundColor: '#004286', color: 'white' } }}
                onClick={() => {
                    setVerifyModal(true);
                    setSelectedRow(props.selectedRow);
                    setCurrentFrequency(props.selectedRow.frequency || '');
                    setSelectedRowData(props.selectedRow);
                }}
            >
                Verify
            </Button>
        );
    }

    const handleEntering = () => {
        if (checkListId) {
            console.log('Calling ChecklistToolList API with toolId:', checkListId);
            ChecklistToolList(
                { id: checkListId },
                (response) => {
                    const data = response?.data || response || [];
                    console.log('ChecklistToolList success:', data);
                    const formattedData = Array.isArray(data) ? data.map((item, index) => ({
                        ...item,
                        id: item.id || index + 1,
                    })) : [];
                    setChecklistShow(formattedData);
                },
                (error) => {
                    console.error('ChecklistToolList API error:', error);
                    setChecklistShow([]);
                }
            );
        } else {
            console.warn('No checkListId provided');
        }
    };

    const handleCancel = () => {
        if (setOpenCheckList) setOpenCheckList(false);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="lg"
            TransitionProps={{ onEntering: handleEntering }}
            open={openCheckList}
            onClose={handleCancel}
            {...other}
        >
            <DialogTitle sx={{ backgroundColor: '#004286', color: '#ffffff', fontWeight: 'bold' }}>
                Checklist Details
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2 }}>
                <Box sx={{ height: 450, width: '100%' }}>
                    <DataGrid
                        rows={checklistShow}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10]}
                        disableRowSelectionOnClick
                        sx={{
                            border: "none",
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#004286',
                                color: '#ffffff',
                                fontWeight: 'bold',
                            },
                        }}
                        getRowClassName={(params) => {
                            const rowIndex = checklistShow.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return '';
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ fontWeight: 'bold', color: '#004286', borderColor: '#004286', '&:hover': { backgroundColor: '#eef5ff' } }}
                >
                    Close
                </Button>
            </DialogActions>

            {verifyModal && (
                <VerifyModal
                    verifyModal={verifyModal}
                    setVerifyModal={setVerifyModal}
                    currentFrequency={currentFrequency}
                    selectedRowData={selectedRowData}
                    selectedDate={selectedDate}
                    calenderDate={calenderDate}
                    rowMaintId={rowMaintId}
                    setRowMaintId={setRowMaintId}
                />
            )}
        </Dialog>
    )
}

export default CheckListDialog
