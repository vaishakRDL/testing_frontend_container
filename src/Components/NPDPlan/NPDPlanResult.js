import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Button, Card, CardContent, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';

import NPDPlanTitle from './NPDPlanTitle';
import { SobResAndDev, SobResAndDevAll } from '../../ApiService/LoginPageService';
import SplitOrderModule from '../OrderPlaningComp/SplitOrderComp/SplitOrderModule';

const NPDPlanResult = () => {
    const [open, setOpen] = useState(false);
    const [spOpen, setSpOpen] = useState(false);
    const [openMrp, setOpenMrp] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editCustomer, setEditCustomer] = useState([]);
    const [npdRndList, setNpdRndList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [seletedItemList, setSeletedItemList] = useState([]);
    const [selectSalesId, setSelectSalesId] = useState('');
    const [selectRowId, setSelectRowId] = useState('');
    const [selectDetails, setSelectDetails] = useState([]);
    const [SelectOptions, setSelectOptions] = useState('SelectOptions');
    const [itemDetaildView, setItemDetaildView] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [arrayList, setArrayList] = useState([])

    const [TypesScheduling, setTypesScheduling] = useState('All');


    const columns = [
        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Kanban Date
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'scheduled Date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Scheduled Date
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Delay Date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Delay
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'priority  Date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Priority
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Status
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span >,
            minWidth: 350, maxWidth: 600,
            cellClassName: 'actions',
            disableClickEventBubbling: true,

            getActions: (params) => [
                <SelectAction selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    useEffect(() => {
        SobResAndDevAll(handleSuccess, handleException);
    }, [refreshData]);

    const handleSuccess = (dataObject) => {
        setNpdRndList(dataObject?.data || []);
    }

    const handleException = () => {

    }

    function SelectAction(props) {

        const handleChange = (e) => {
            const value = e.target.value;
            if (value === 'SplitOrder') {
                setSpOpen(true);
                setSelectSalesId(props?.selectedRow?.saleId || '');
                setSelectDetails(props?.selectedRow || []);
            } else if (value === 'Mrp') {
                setOpenMrp(true);
                console.log('props?.selectedRow====>', props?.selectedRow?.id)
                setSelectRowId(props?.selectedRow?.id || '');
            } else {
                setSpOpen(false);
                setOpenMrp(false);
            }
        };

        return (
            <div style={{ display: 'flex' }}>
                <FormControl style={{ width: '250px' }}>
                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size='small'
                        // value={SelectOptions}
                        // label="Age"
                        defaultValue={SelectOptions}
                        onChange={handleChange}
                    >
                        <MenuItem value='SelectOptions'>Select Options</MenuItem>
                        <MenuItem value='Hold'>Hold</MenuItem>
                        <MenuItem value='Mrp'>MRP</MenuItem>
                        {/* <MenuItem value='GanttChart'>Gantt Chart</MenuItem> */}
                        <MenuItem value='PlanOrder'>Schedule Order</MenuItem>
                        <MenuItem value='RescheduleOrder'>Reschedule Order</MenuItem>
                        <MenuItem value='SplitOrder'>Split Order</MenuItem>
                        <MenuItem value='FreeComplete'>Force Complete</MenuItem>
                    </Select>
                </FormControl>
            </div>
        );
    }

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    function RowSelectAction(props) {

        const onSelectedItem = () => {
            setArrayList([...arrayList, props.selectedRow]);
        }


        return (
            <div style={{ display: 'flex' }}>
                <Checkbox {...label}
                    checked={arrayList?.id === props.selectedRow ? true : false}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {

                }}
                style={{ color: 'black' }}
            />
        );
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const OnChangeType = (e) => {
        setTypesScheduling(e.target.value)
    }

    const handleRowClick = (e) => {
        setItemDetaildView(true);
        setSelectSalesId(e.row.saleId || '');
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <NPDPlanTitle
                setIsAddButton={setIsAddButton}
                setEditCustomer={setEditCustomer}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around',marginTop:'-5px' }}>
                <Grid container spacing={2} style={{width:'99%'}}>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ }}>
                        <FormControl fullWidth

                        >
                            <InputLabel id="demo-simple-select-label">Types of Scheduling</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={TypesScheduling}
                                size='small'
                                label="Customer Name"
                                variant="filled"
                                onChange={OnChangeType}
                            >
                                <MenuItem value={'Padding Order'}>Padding Order</MenuItem>
                                <MenuItem value={'Scheduled_and_Process Order'}>Scheduled and Process Order</MenuItem>
                                <MenuItem value={'Hold'}>Hold</MenuItem>
                                <MenuItem value={'All'}>All</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                        style={{
                           
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'

                        }} >
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <DataGrid
                                    rows={npdRndList}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    onRowClick={handleRowClick}
                                    disableSelectionOnClick
                                    style={{ border: 'none', }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '62vh',
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
                                        const rowIndex = npdRndList.findIndex(row => row.id === params.row.id);
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
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>

            </div>


            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <SplitOrderModule
                setOpen={setSpOpen}
                open={spOpen}
                seletedItemList={arrayList}
                setSeletedItemList={setArrayList}
                selectSalesId={selectSalesId}
                selectDetails={selectDetails}
            />

        </div >
    )
}

export default NPDPlanResult