import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Card, CardContent, Checkbox, Grid, Typography } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';

// import PartMasterTitle from './PartMasterTitle';
// import PartMasterModule from './PartMasterModule';
// import StoresItemMasterTitle from './StoresItemMasterTitle';
// import StoresItemMasterModule from './StoresItemMasterModule';
import { ShowStoreItemMaster, StoreItemDelete } from '../../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SecondLevelAuthorizationModule = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [storeItemMasterList, setStoreItemMasterList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')

    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);


    const columns = [
        {
            field: 'itmCode',
            headerName: 'PO No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itmName',
            headerName: 'PO Date',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itmGroup',
            headerName: 'SUPP Code',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itmGroupName',
            headerName: 'SUPP Name',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'potype',
            headerName: 'PO Type',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Reference',
            headerName: 'Reference',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Added By',
            headerName: 'Added By',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'First Auth By',
            headerName: 'First Auth By',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <CheckBoxData selectedRow={params.row} />,
            ],
        },
    ];

    function CheckBoxData(props) {
        const { selectedRow } = props;
        // console.log("90909090909090909090", selectedRow)

        const handleCheckboxChange = (e) => {
            const updatedSelectedCheckboxes = { ...selectedCheckboxes, [selectedRow.id]: e.target.checked };
            setSelectedCheckboxes(updatedSelectedCheckboxes);

            const isChecked = e.target.checked;

            if (isChecked) {
                // If the checkbox is checked, add the selected row to the array
                setSelectedRows((prevSelectedRows) => [...prevSelectedRows, selectedRow]);
            } else {
                // If the checkbox is unchecked, remove the selected row from the array
                setSelectedRows((prevSelectedRows) =>
                    prevSelectedRows.filter((row) => row.id !== selectedRow.id)
                );
            }
        };
        return (
            <Checkbox
                {...label}
                checked={selectedCheckboxes[selectedRow.id] || false}
                onChange={handleCheckboxChange}
            />
        );
    }


    useEffect(() => {
        // ShowStoreItemMaster(handleSucessShow, handleExceptionShow);
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setStoreItemMasterList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: '#000000' }}
                onClick={(event) => {
                    setIsAddButton(false);
                    setEditeData(props.selectedRow);
                    setOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{ color: 'black' }}
            />
        );
    }

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

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            {/* <StoresItemMasterTitle
                setIsAddButton={setIsAddButton}
                setEditeData={setEditeData}
                setOpen={setOpen}
            /> */}

            <Grid container>
                <Grid item marginLeft={1.5}>
                    <Typography
                        sx={{ m: 1, fontFamily: 'Roboto Slab' }}
                        variant="h5"
                    >2nd Level Authorization : Purchase Order</Typography>
                </Grid>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <DataGrid
                            // rows={processList.map((row) => ({
                            //     ...row,
                            //     skip: skipValues[row.id] || '', // Update skip value
                            //     quality: qualityValues[row.id] || '', // Update quality value
                            //     selected: selectedCheckboxes[row.id] || false,
                            //     item: selectedItemId,
                            //     cycleTime: editedCycleTime[row.id] || row.CycleTime,
                            //     processPriority: editedProcessPriority[row.id] || row.processPriority,
                            // }))}
                            rows={[]}
                            columns={columns}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                overflow: 'auto',
                                height: '50vh',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    WebkitTextStrokeWidth: '0.6px',
                                },
                                '& .MuiDataGrid-cell': {
                                    border: '1px solid #969696',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    border: '1px solid #969696', // Add border to column headers
                                },
                            }}

                            rowHeight={40}
                            columnHeaderHeight={40}
                        />
                    </CardContent>
                </Card>

            </div>

            {/* <StoresItemMasterModule
                isAddButton={isAddButton}
                editeData={editeData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            /> */}
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
                deleteService={StoreItemDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default SecondLevelAuthorizationModule