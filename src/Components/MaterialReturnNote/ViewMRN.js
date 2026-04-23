import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GetAllMrnData } from '../../ApiService/LoginPageService';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";

const ViewMRN = ({ viewModalOpen, setViewModalOpen, handleViewMrn, setIsView, setIsEdit }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [mrnLists, setMrnLists] = useState([]);

    useEffect(() => {
        viewModalOpen && GetAllMrnData(handleGetSuccess, handleGetException)
    }, [viewModalOpen])

    const handleGetSuccess = (dataObject) => {
        setMrnLists(dataObject?.data || [])
    }
    const handleGetException = () => { }

    const BillingColumns = [
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName: 'Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'mrnNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'MRN No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'createdBy',
            headerClassName: 'super-app-theme--header',
            headerName: 'Created By',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "actions",
            headerClassName: "super-app-theme--header",
            type: "actions",
            flex: 1,
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
            ),
            cellClassName: "actions",
            disableClickEventBubbling: true,
            getActions: (params) => [
                <ViewData selectedRow={params.row.id} />,
                <EditData selectedRow={params.row.id} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function ViewData(props) {
        return (
            <Tooltip disableFocusListener title="View">
                <VisibilityIcon
                    style={{ color: "#002D68", cursor: "pointer" }}
                    onClick={() => {
                        handleViewMrn(props.selectedRow);
                        setViewModalOpen(false);
                        setIsView(true);
                        setIsEdit(false);
                    }}
                />
            </Tooltip>
        );
    }

    function EditData(props) {
        return (
            <Tooltip disableFocusListener title="Edit">
                <EditIcon
                    style={{ color: "#002D68", cursor: "pointer" }}
                    onClick={() => {
                        handleViewMrn(props.selectedRow);
                        setViewModalOpen(false);
                        setIsEdit(true);
                        setIsView(false);
                    }}
                />
            </Tooltip>
        );
    }

    function DeleteData(props) {
        return (
            <Tooltip title="Delete">
                <DeleteIcon
                    style={{ color: "#002D68", cursor: "pointer" }}
                // onClick={() => {
                //     setDeleteId(props.selectedRow.id);
                //     console.log(props.selectedRow.id);
                //     setDeleteDailogOpen(true);
                // }}
                />
            </Tooltip>
        );
    }

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={viewModalOpen}>
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                View Material Return Note
            </DialogTitle>
            <form className="mt-2 space-y-6">
                <DialogContent>

                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={mrnLists}
                                        columns={BillingColumns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        style={{ border: 'none' }}
                                        sx={{
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919',
                                                cursor: 'pointer'
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                                cursor: 'pointer'
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                                cursor: 'pointer'
                                            },
                                        }}
                                        // getRowClassName={(params) => {
                                        //     const rowIndex = custAllAddressList.findIndex(row => row.id === params.row.id);
                                        //     if (rowIndex !== -1) {
                                        //         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        //     }
                                        //     return '';
                                        // }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions >
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={() => setViewModalOpen(false)}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default ViewMRN
