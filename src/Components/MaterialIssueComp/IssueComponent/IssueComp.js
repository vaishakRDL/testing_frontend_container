import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Card, CardContent, LinearProgress, MenuItem, Select } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { ShowSFG, SFGDelete, GetMaterialIssueRowData } from '../../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import { Link, useLocation } from 'react-router-dom';
import IssueTittle from './IssueTittle';
import IssueModal from './IssueModal';

const IssueComp = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [selctedId, setSelectedId] = useState([])
    const [deleteId, setDeleteId] = useState([])
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState('');

    //MATERIAL ISSUE LIST
    const location = useLocation();
    const issueId = new URLSearchParams(location.search).get('issueId');
    const [materialIssueList, setMaterialIssueList] = useState([]);
    const [rowId, setRowId] = useState('');
    const [shelfLifeItem, setShelfLifeItem] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [rawMaterial, setRawMaterial] = useState('');
    const [uom, setUOM] = useState('');
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [issueLoader, setIssueLoader] = useState(false);
    const [category, setCategory] = useState('');

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>S No</span>,
            type: 'string',
            sortable: true,
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        // Conditionally include the 'nestNo' column
        ...(category === 'Production' ? [{
            field: 'nestNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Nesting Id</span>,
            type: 'string',
            sortable: true,
            width: 250,
            align: 'center',
            headerAlign: 'center',
        }] : []),
        ...(category === 'Production' ? [
            {
                field: 'jcNos',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Cards</span>,
                type: 'string',
                sortable: true,
                width: 400,
                align: 'center',
                headerAlign: 'center',
            }
        ] : [
            {
                field: 'jcNo',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
                type: 'string',
                sortable: true,
                width: 200,
                align: 'center',
                headerAlign: 'center',
            },
        ]),
        // {
        //     field: 'jcNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 120,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'srnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SRN No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'srnDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SRN Date</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part/Item No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'fim',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>FIM</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'rawMaterialName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Raw Material Name</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>,
            type: 'number',
            sortable: true,
            width: 200,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'defaultStockLock',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Default Stock</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },

        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Available Stock</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },

        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'reqQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Qty Required</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'allocQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocated Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'issuedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Issued Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'location',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
        //     cellClassName: 'actions',
        //     width: 200,
        //     align: 'center', headerAlign: 'center',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <Issue selectedRow={params.row} />,
        //     ],
        // },
    ];

    useEffect(() => {
        issueId && GetMaterialIssueRowData({ id: issueId }, handleSucessShow, handleExceptionShow);
    }, [refreshData, issueId]);

    const handleSucessShow = (dataObject) => {
        setMaterialIssueList(dataObject?.data || []);
        setCategory(dataObject?.data[0]?.category || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(materialIssueList);

    // function Issue(props) {
    //     return (
    //         <Button
    //             variant="contained"
    //             onClick={() => {
    //                 setIssueModalOpen(true);
    //                 setRowId(props.selectedRow.id);
    //                 setShelfLifeItem(props.selectedRow.shelfLifeItem);
    //                 setItemCode(props.selectedRow.itemCode);
    //                 setRawMaterial(props.selectedRow.rawMaterialName);
    //                 setUOM(props.selectedRow.uom);
    //                 setRequiredQuantity(Number(props?.selectedRow?.reqQty) - Number(props?.selectedRow?.issuedQty));
    //                 setSelectedRowData(props.selectedRow);
    //             }}
    //             style={{ width: '100px', background: '#002D68', color: 'white', fontSize: 12 }}
    //         >
    //             Issue
    //         </Button>
    //     );
    // }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleRowSelection = (selectionModel) => {
        setSelectedId(selectionModel);
        // Find the selected rows based on IDs
        const selectedData = rowData.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
    };

    const handleIssue = (selectedRow) => {
        setIssueModalOpen(true);
        setRowId(selectedRow.id);
        setShelfLifeItem(selectedRow.shelfLifeItem);
        setItemCode(selectedRow.itemCode);
        setRawMaterial(selectedRow.rawMaterialName);
        setUOM(selectedRow.uom);
        setRequiredQuantity(Number(selectedRow.reqQty) - Number(selectedRow.issuedQty));
        setSelectedRowData(selectedRow);
    };

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <IssueTittle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                issueId={issueId}
                setIssueLoader={setIssueLoader}
                setRefreshData={setRefreshData}
                selctedId={selctedId}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
                    {issueLoader &&
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    }
                    <CardContent>
                        <Box
                            sx={{
                                height: '150%',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    backgroundColor: '#93bce6',
                                    color: '#1c1919'
                                },
                            }}
                        >
                            <DataGrid
                                rows={rowData}
                                columns={columns}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                checkboxSelection
                                onRowClick={(params) => handleIssue(params.row)} disableRowSelectionOnClick
                                onRowSelectionModelChange={handleRowSelection}
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: screenHeight-285,
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',

                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696',
                                    },
                                }}
                                getRowClassName={(params) => {
                                    const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </Box>
                    </CardContent>
                </Card>

            </div>

            <IssueModal
                issueModalOpen={issueModalOpen}
                setIssueModalOpen={setIssueModalOpen}
                rowId={rowId}
                itemCode={itemCode}
                rawMaterialName={rawMaterial}
                uom={uom}
                requiredQuantity={requiredQuantity}
                selectedRowData={selectedRowData}
                setRefreshData={setRefreshData}
                shelfLifeItem={shelfLifeItem}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                deleteService={SFGDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default IssueComp