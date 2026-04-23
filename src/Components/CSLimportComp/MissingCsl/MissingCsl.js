import { Autocomplete, Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, TextField, Typography } from '@mui/material';
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { CslMissing, PlanningFim, SobDeletedItems, SobMissingCsl, SobMissingCslDelete, SobMoveItems, SobResAndDev } from '../../../ApiService/LoginPageService';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import MoveRDView from '../MoveR&DView/MoveRDView';
import '../../../App.css';
import DeleteConfirmationDailog3 from '../../../Utility/confirmDeletion3';
import { CSVLink } from 'react-csv';
import { darken, lighten } from '@mui/material/styles';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { SobExlMissingCsl } from '../../../ApiService/DownloadCsvReportsService';

const MissingCsl = ({ openMissing, setOpenMisiing, cslId, masterId,  }) => {

    const [missData, setMissData] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [refreshData, setRefreshData] = useState(true);
    const [arrayList, setArrayList] = useState([]);
    const [arrayIdList, setArrayIdList] = useState([]);
    const [openRd, setOpenRD] = useState(false);
    const [deleView, setDeleteView] = useState('0');
    const [dataList, setDataList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [deleteItemIdList, setDeleteItemIdList] = useState([]);
    const [planningFim, setPlanningFim] = useState([]);
    const [fimNoId, setFimNoId] = useState('');
    const [isDeleteAll, setIsDeletAll] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {

        if (openMissing) {
            if (cslId) {
                CslMissing({
                    id: cslId
                }, handleCslMissingSuccess, handleCslMissingException);
            } else {
                SobMissingCsl({
                    id: fimNoId || '',
                    sobMstId: masterId
                }, handleCslMissingSuccess, handleCslMissingException);
                PlanningFim({
                    sobMstId: masterId
                }, PlanningFimsuccess, PlanningFimException);
            }
        }

    }, [cslId, refreshData, openMissing, fimNoId, masterId]);

    useEffect(() => {

        if (selectAll || arrayIdList.length > 0) {
            setIsDeletAll(true);
        } else {
            setIsDeletAll(false);
            setArrayList([]);
        }

    }, [selectAll, arrayIdList]);

    console.log('selectAll0000', selectAll);
    console.log('arrayIdList.length', arrayIdList.length);

    const PlanningFimsuccess = (dataObject) => {
        setPlanningFim(dataObject?.data || []);
    }

    const PlanningFimException = () => {

    }

    const handleCslMissingSuccess = (dataObject) => {
        setMissData(dataObject?.data || []);
    }

    const handleCslMissingException = (errorObject, errorMessage) => {
        console.log('error:', errorMessage);

    }

    const selectAllData = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setArrayList(missData);
        } else {
            setArrayList([]);
        }
    }

    const columns = [

        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No
                </span>
            ),

            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part No
                </span>
            ),

            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'description',
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Description
                </span>
            ),

            sortable: true,
            minWidth: 50,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order Qty
                </span>
            ),

            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fim',
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    FIM No
                </span>
            ),

            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        !cslId
        ? {
            field: 'actions',
            type: 'actions',
            flex: 1,
            minWidth: 100,
            headerClassName: 'super-app-theme--header',
            headerName: (
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                <Checkbox
                  value={selectAll}
                  label="Select All"
                  onClick={selectAllData}
                />
                Actions
              </span>
            ),
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
              <SelectItem selectedRow={params.row} />,
              <DeleteData selectedRow={params.row} />,
            ],
          }
        : null,
    ].filter(Boolean);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    // function SelectItem(props) {
    //     const onSelectedItem = () => {
    //         setArrayList((prevArrayList) => {
    //             const isRowSelected = prevArrayList.some(item => item === props.selectedRow.id);

    //             if (isRowSelected) {
    //                 return prevArrayList.filter(item => item !== props.selectedRow.id);
    //             } else {
    //                 return [...prevArrayList, props.selectedRow.id];
    //             }
    //         });
    //     };

    //     return (
    //         <Checkbox
    //             {...label}  
    //             checked={arrayList.includes(props.selectedRow.id)}
    //             onClick={onSelectedItem}
    //         />
    //     );
    // }

    function SelectItem(props) {

        const onSelectedItem = () => {
            if (arrayList.some(item => item.id === props.selectedRow.id)) {
                // If the item is already in the list, remove it
                setArrayList(arrayList.filter(item => item.id !== props.selectedRow.id));
                setArrayIdList(arrayList.filter(item => item.id !== props.selectedRow.id));
            } else {
                // If the item is not in the list, add it
                setArrayList([...arrayList, props.selectedRow]);
                // const test = [...arrayList.map(item => item.id), props.selectedRow?.id];
                // console.log("111111111", test);
                setArrayIdList([...arrayList.map(item => item.id), props.selectedRow?.id]);
            }
        }

        return (
            <div style={{ display: 'flex' }}>
                <Checkbox
                    checked={arrayList.some(item => item.id === props.selectedRow.id)}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                // disabled={true}
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
            setSelectAll((oldvalue) => !oldvalue);
            setArrayList([]);
            setArrayIdList([]);
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

    const handleSobMoveItemsSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setArrayIdList([]);
            setRefreshData((oldvalue) => !oldvalue);
            handleClose();
        }, 3000);
    }

    const handleExceptionSobMoveItems = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    const handleSuccess = (dataObject) => {
        setDataList(dataObject?.data || []);
    }

    const handleException = (errorObject, errorMessage) => {
        console.log('error:', errorMessage);

    }

    // const onClickDeleteAll=()=>{
    //     setDeleteItemIdList(arrayList.filter(item => item.id));
    // }

    const onClickDeleteAll = () => {
        const idList = arrayList.map(item => item.id);
        setDeleteItemIdList(idList || arrayIdList);
        setDeleteDailogOpen(true);

    };

    const SobExlMissingCslSuccess = () => {

    }

    const SobExlMissingCslException = () => {

    }

    const convertToCSV = () => {
        // // Create CSV string
        // const csvData = [
        //     Object.keys(missData[0]), // Headers
        //     ...missData.map(row => Object.values(row)) // Data rows
        // ].map(row => row.join(',')) // Join row elements with commas
        //     .join('\n'); // Join rows with newline characters

        // // Create Blob from CSV string
        // const blob = new Blob([csvData], { type: 'text/csv' });

        // // Create URL for Blob
        // const url = window.URL.createObjectURL(blob);

        // // Create link element to trigger download
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = 'data.csv'; // File name
        // document.body.appendChild(link);

        // // Trigger download
        // link.click();

        // // Cleanup
        // window.URL.revokeObjectURL(url);
        // document.body.removeChild(link);
        SobExlMissingCsl({
            id: fimNoId,
            sobMstId: masterId
        }, SobExlMissingCslSuccess, SobExlMissingCslException);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer style={{ float: 'right', color: 'purple', cursor: 'pointer' }}>
                <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
        );
    }

    const options = planningFim.map(item => ({
        id: item?.id,
        label: item?.fim
    }));

    const handleAutocompleteChange = (selectedValue) => {
        setFimNoId(selectedValue?.label || '');
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            // open={openMissing}
            open={openMissing}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Missing CSL
                <Grid item xs={12} md={8} lg={12} sm={12}>
                    <Card style={{ borderRadius: '8px', height: '65px', width: '350px' }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                size='small'
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By FIM NO " />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </DialogTitle>

            <DialogContent>

                <Grid item md={12} style={{ marginTop: '5px' }}>


                    {/* <DataGrid
                        rows={missData}
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
                        }}
                        getRowClassName={(params) => {
                            // Find the index of the row within the rows array
                            const rowIndex = missData.findIndex(row => row.id === params.row.id);
                            // Check if the index is valid
                            if (rowIndex !== -1) {
                                console.log(' ');
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return ''; // Return default class if index is not found
                        }}
                    /> */}



                    {/* DataGrid component */}
                    <DataGrid
                        rows={missData}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none' }}
                        sx={{
                            overflow: 'auto',
                            height: '55vh',
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
                            const rowIndex = missData.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return '';
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                {
                    !cslId ? (
                        <>
                            {isDeleteAll ? (

                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={onClickDeleteAll}
                                >
                                    Delete All
                                </Button>
                            ) : (
                                <></>
                            )

                            }

                            <Button variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={convertToCSV}>Export </Button>
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    SobMoveItems({
                                        data: arrayIdList
                                    }, handleSobMoveItemsSuccess, handleExceptionSobMoveItems);
                                }}
                            >
                                Move to R&D
                            </Button>

                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    setOpenRD(true);
                                    setDeleteView('0');
                                    SobResAndDev(handleSuccess, handleException);
                                }}
                            >
                                View R&D List
                            </Button>

                            <Button
                                variant="contained"
                                style={{ width: '200px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    setOpenRD(true);
                                    setDeleteView('1');
                                    SobDeletedItems(handleSuccess, handleException);
                                }}
                            >
                                View Deleted Items
                            </Button>
                        </>
                    ) : (
                        <> </>
                    )
                }

                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setOpenMisiing(false);
                        setSelectAll((oldvalue) => !oldvalue);
                        // setRefeshMissing(oldvalue => !oldvalue);
                        setFimNoId('');
                        setMissData([]);
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

            <DeleteConfirmationDailog3
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                itemId={deleteId}
                deleteService={SobMissingCslDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
                deleteItemIdList={deleteItemIdList}
            />

            <MoveRDView
                openRd={openRd}
                setOpenRD={setOpenRD}
                deleView={deleView}
                dataList={dataList}
                setDataList={setDataList}
            />
        </Dialog>
    )
}

export default MissingCsl
