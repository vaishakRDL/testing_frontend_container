import React, { useState, useEffect } from 'react';
import { Autocomplete, Button, Card, CardContent, CircularProgress, Checkbox, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import ItemVsProcessTitle from './ItemVsProcessTitle';
import { GetItemVsProcessProcessList, AddItemVsProcess, GetSearchedItems, handleProcessDeselect, GetSearchedToolItems } from '../../ApiService/LoginPageService';
import ImportFromExcelModal from './ImportFromExcelModal/ImportFromExcelModal';
import CopyFromModal from './CopyFromModal/CopyFromModal';
import MachineDeselectModal from './MachineDeselectModal/MachineDeselectModal';
import MachinePartNoList from './MachinePartNoList/MachinePartNoList';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useModuleLocks } from '../context/ModuleLockContext';

const ToolSearchEditCell = ({ id, field, value, api }) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [selctedToolid, setSelctedToolId] = useState('');
    const [options, setOptions] = useState([]);
    const [toolItemList, setToolItemList] = useState([]);
    const [loading, setLoading] = useState(false);



    const handleToolChange = (e) => {
        const searchText = e.target.value;
        if (!searchText) return;

        setLoading(true);
        GetSearchedToolItems(
            { code: searchText },
            (dataObject) => {
                const options = (dataObject?.data || []).map((item) => ({
                    id: item?.id,
                    label: item?.toolNo,
                }));
                setToolItemList(options);
                setLoading(false);
            },
            () => setLoading(false)
        );
    };
    // const handleToolSelect = (event, newValue) => {
    //     if (newValue) {
    //         // ✅ Update the row with the selected tool
    //         api.setEditCellValue(
    //             { id, field, value: { id: newValue.id, label: newValue.label } },
    //             event
    //         );
    //     }
    // };
    const handleToolSelect = (event, newValue) => {
        if (newValue) {
            api.setEditCellValue(
                {
                    id,
                    field,
                    value: {
                        toolId: newValue.id,
                        toolNo: newValue.label,
                    },
                },
                event
            );
        }
    };

    return (

        <Autocomplete
            fullWidth
            options={toolItemList}
            getOptionLabel={(option) => option.label || ''}
            onChange={handleToolSelect}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tool Search"
                    variant="standard"
                    onChange={handleToolChange}
                    autoFocus
                />
            )}
        />
    );
};
const ItemVsProcess = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Item vs Process")?.lockStatus === "locked";


    const [saveloading, setsaveloading] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState([])
    const [processList, setProcessList] = useState([])
    const [newDataArray, setNewDataArray] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedItemId, setSelectedItemId] = useState('')
    const [excelModal, setExcelModal] = useState(false);
    const [copyFromModal, setCopyFromModal] = useState(false);
    const [machineDeselectModal, setMachineDeselectModal] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [itemList, setItemList] = useState([])
    const [machinePartListModal, setMachinePartListModal] = useState(false);
    const [machineId, setMachineId] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [process, setProcess] = useState('');
    const [deselectedItemList, setDeselectedItemList] = useState([]);
    console.log("selectedProcess", selectedProcess)

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
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

    useEffect(() => {
        GetItemVsProcessProcessList({ item: selectedItemId }, handleItemVsProcessListSucessShow, handleItemVsProcessListExceptionShow);
    }, [refreshData, selectedItemId]);

    const handleItemVsProcessListSucessShow = (dataObject) => {
        // setProcessList(dataObject?.data || []);
        // setNewDataArray(dataObject?.data || []);
        const formatted = dataObject?.data?.map((item) => ({
            ...item,
            toolNo: item.toolId ? { toolId: item.toolId, toolNo: item.toolNo } : null,
        }));
        setNewDataArray(formatted || []);
    }


    const handleItemVsProcessListExceptionShow = (errorObject, errorMessage) => {

    }



    const handleSubmitClick = () => {
        setsaveloading(true)
        // const updatedArray = selectedProcess.map(obj => (
        //     {
        //         ...obj,
        //         item: selectedItemId,

        //     }))
        const updatedArray = selectedProcess.map((row) => {
            return {
                ...row,
                item: selectedItemId,
                toolId: row.toolNo?.toolId || null, // ✅ pass only the id
                toolNo: row.toolNo?.toolNo || '',   // ✅ pass only the label
            };
        });
        const concatinatedSelectedDeselectedArray = [...updatedArray, ...deselectedItemList];
        AddItemVsProcess(concatinatedSelectedDeselectedArray, handleSuccess, handleException);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleSuccess = (dataObject) => {
        setsaveloading(false)

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };
    const handleException = (errorObject, errorMessage) => {
        setsaveloading(false)
        console.log("errorMessage===>", errorMessage)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
        }, 2000);
    };

    const columnsUpdated = [
        {
            field: 'process',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Name</span>,
            // headerName: 'Process Name',
            type: 'string',
            sortable: true,
            minWidth: 180,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine Code</span>,
            // headerName: 'Machine Code',
            type: 'string',
            sortable: true,
            minWidth: 180, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            // headerName: 'UOM',
            type: 'number',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'toolNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Tool</span>,
        //     type: 'string',
        //     editable: true,
        //     minWidth: 200,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        //     renderCell: (params) => {
        //         // return <span>{params?.value?.label || ''}</span>; // ✅ Show selected tool
        //         return <span>{params.value?.toolNo || ''}</span>;

        //     },
        //     renderEditCell: (params) => <ToolSearchEditCell {...params} />,
        // },
        {
            field: 'count',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Count</span>,
            // headerName: 'Count',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1, align: 'center', headerAlign: 'center',
            editable: true,
            headerTooltip: 'Enter the count here',
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', marginRight: '5px', fontWeight: 'bold', }}>Count</span>
                    <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} />
                </div>
            ),
        },

        {
            field: 'cycleTime',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cycle Time</span>,
            // headerName: 'Cycle Time',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center', headerAlign: 'center',
            editable: true,
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', marginRight: '5px', fontWeight: 'bold', }}>Cycle Time</span>
                    <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} />
                </div>
            ),
        },
        {
            field: 'processPriority',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Priority</span>,
            // headerName: 'Process Priority',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center', headerAlign: 'center',
            editable: true,
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', marginRight: '5px', fontWeight: 'bold', }}>Process Priority</span>
                    <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} />
                </div>
            ),
        },
        {
            field: 'range',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Price Range</span>,
            // headerName: 'Cycle Time',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center', headerAlign: 'center',
            editable: true,
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', marginRight: '5px', fontWeight: 'bold', }}>Price Range</span>
                    {/* <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} /> */}
                </div>
            ),
        },
        {
            field: 'selected',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Select</span>,
            // headerName: 'Select',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => [
                <CheckBoxDataSelector selectedRow={params.row} />,
            ],
        },
    ];

    // SKIP
    const SkipSelector = (props) => {
        const handleChange = (e) => {
            const editedSelectedArray = selectedProcess.map((item) =>
                item.id === props.selectedRow.id
                    ? {
                        ...item, skip: e.target.value
                    }
                    : item
            );
            setSelectedProcess(editedSelectedArray);

            const editedOriginaldArray = newDataArray.map((item) =>
                item.id === props.selectedRow.id
                    ? {
                        ...item, skip: e.target.value
                    }
                    : item
            );
            setNewDataArray(editedOriginaldArray);
        }
        return (
            <FormControl fullWidth variant="standard">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.selectedRow.skip}
                    label="Age"
                    onChange={handleChange}
                    disabled={true}
                >
                    <MenuItem value={0}>No</MenuItem>
                    <MenuItem value={1}>Yes</MenuItem>
                </Select>
            </FormControl>
        )
    }

    // // QUALITY
    // const QualitySelector = (props) => {
    //     const handleChange = (e) => {
    //         const editedSelectedArray = selectedProcess.map((item) =>
    //             item.id === props.selectedRow.id
    //                 ? {
    //                     ...item, quality: e.target.value
    //                 }
    //                 : item
    //         );
    //         setSelectedProcess(editedSelectedArray);
    //         const editedOriginaldArray = newDataArray.map((item) =>
    //             item.id === props.selectedRow.id
    //                 ? {
    //                     ...item, quality: e.target.value
    //                 }
    //                 : item
    //         );
    //         setNewDataArray(editedOriginaldArray);
    //     }
    //     return (
    //         <FormControl fullWidth variant="standard">
    //             <Select
    //                 labelId="demo-simple-select-label"
    //                 id="demo-simple-select"
    //                 value={props.selectedRow.quality}
    //                 label="Age"
    //                 onChange={handleChange}
    //             >
    //                 <MenuItem value={'No'}>No</MenuItem>
    //                 <MenuItem value={'Yes'}>Yes</MenuItem>
    //             </Select>
    //         </FormControl>
    //     )
    // }

    // VENDOR PROCESS
    const VendorProcess = (props) => {
        const handleChange = (e) => {
            const editedSelectedArray = selectedProcess.map((item) =>
                item.id === props.selectedRow.id
                    ? {
                        ...item, vendorProcess: e.target.value
                    }
                    : item
            );
            setSelectedProcess(editedSelectedArray);
            const editedOriginaldArray = newDataArray.map((item) =>
                item.id === props.selectedRow.id
                    ? {
                        ...item, vendorProcess: e.target.value
                    }
                    : item
            );
            setNewDataArray(editedOriginaldArray);
        }
        console.log('props.selectedRow.vendorProcess', props.selectedRow.vendorProcess)
        return (
            <FormControl fullWidth variant="standard">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.selectedRow.vendorProcess}
                    label="Age"
                    onChange={handleChange}
                    disabled={true}
                >
                    <MenuItem value={0}>InHouse</MenuItem>
                    <MenuItem value={1}>Vendor Process</MenuItem>
                </Select>
            </FormControl>
        )
    }

    const CheckBoxDataSelector = (props) => {
        const handleChange = (e) => {
            if (e.target.checked) {
                const updatedSelectedRow = {
                    ...props.selectedRow,
                    selected: e.target.checked
                };
                setSelectedProcess([...selectedProcess, updatedSelectedRow]);
                // setSelectedProcess([...selectedProcess, props.selectedRow]);
            } else {
                const filteredArray = selectedProcess.filter((item) => item.id !== props.selectedRow.id);
                setSelectedProcess(filteredArray);
            }
            const updatedList = newDataArray.map((process) =>
                process.id === props.selectedRow.id
                    ? {
                        ...process,
                        selected: e.target.checked
                    }
                    : process
            );
            setNewDataArray(updatedList);

            // DESELECTION PART CODE
            newDataArray.map((item) => {
                if (item.id === props.selectedRow.id) {
                    if (e.target.checked === false && item.itemVsPmId !== null) {
                        const updatedSelectedRow = {
                            ...props.selectedRow,
                            selected: e.target.checked
                        };
                        setDeselectedItemList([...deselectedItemList, updatedSelectedRow])
                    } else {
                        const filteredDeselectedItemList = deselectedItemList.filter((item) => item.id !== props.selectedRow.id)
                        setDeselectedItemList(filteredDeselectedItemList)
                    }
                }
            })
        }

        return (
            <Checkbox
                checked={props.selectedRow.selected || newDataArray.selected}
                onChange={handleChange}
            />
        )
    }
    console.log("DeselectedItemList-------------->>>>>", deselectedItemList);

    // const handleCellEdit = (params) => {
    //     const editedSelectedArray = selectedProcess.map((item) =>
    //         item.id === params.id
    //             ? {
    //                 ...params
    //             }
    //             : item
    //     );
    //     setSelectedProcess(editedSelectedArray);
    //     const editedOriginaldArray = newDataArray.map((item) =>
    //         item.id === params.id
    //             ? {
    //                 ...params
    //             }
    //             : item
    //     );
    //     setNewDataArray(editedOriginaldArray);
    // }

    const handleCellEdit = (params) => {
        // Update selectedProcess array
        const editedSelectedArray = selectedProcess.map((item) =>
            item.id === params.id
                ? { ...item, ...params }
                : item
        );
        setSelectedProcess(editedSelectedArray);

        // Update main data array
        const editedOriginalArray = newDataArray.map((item) =>
            item.id === params.id
                ? { ...item, ...params }
                : item
        );
        setNewDataArray(editedOriginalArray);

        return params; // Return updated row if using with processRowUpdate
    };



    const ClearData = () => {
        // setSelectedItemId('');
        setRefreshKey((prevKey) => prevKey + 1);
        setSelectedProcess([]);
        setDeselectedItemList([]);
        setTimeout(() => {
            GetItemVsProcessProcessList({ item: selectedItemId }, handleItemVsProcessListSucessShow, handleItemVsProcessListExceptionShow);
        }, 1000);
    }



    const handleExcelModelOpen = () => {
        setExcelModal(true);
    }

    const handleCopyFromModelOpen = () => {
        setCopyFromModal(true);
    }

    const handleMachineDeselectModelOpen = () => {
        setMachineDeselectModal(true);
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            setSelectedItemId(value.id)

        }
    }

    const handleChange = (e) => {
        GetSearchedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleCellClick = (params) => {
        (params.field === 'machineCode')
            &&
            (setMachinePartListModal(true))
        setMachineId(params.row.machineId);
        setMachineCode(params.row.machineCode);
        setProcess(params.row.process);
    }

    const handleMachineDeselect = () => {
        const filteredDeselectedItemList = deselectedItemList.map((item) => ({ itemVsPmId: item.itemVsPmId }))
        handleProcessDeselect(filteredDeselectedItemList, handleDeselectSucess, handleDeselectException)
    }

    const handleDeselectSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleDeselectException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 2000);
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <ItemVsProcessTitle
            />
            <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingBottom={2} >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={itemList}
                        size='small'
                        sx={{ width: 300, marginBottom: '15px' }}
                        renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                        onChange={(event, value) => handleSupplierSearchItemChange(value)}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginTop: '-20px' }}>
                    <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
                            <DataGrid
                                rows={newDataArray}
                                columns={columnsUpdated}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: screenHeight - 360,
                                    width: '100%',
                                    cursor: 'pointer',
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
                                // processRowUpdate={handleCellEdit}
                                processRowUpdate={(newRow) => {
                                    return handleCellEdit(newRow); // must return updated row
                                }}
                                getRowClassName={(params) => {
                                    // Find the index of the row within the rows array
                                    const rowIndex = newDataArray.findIndex(row => row.id === params.row.id);
                                    // Check if the index is valid
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return ''; // Return default class if index is not found
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                                key={refreshKey}
                                onCellClick={handleCellClick}
                            />

                            <Grid container style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Grid>
                                    <Button variant="contained" disabled={isModuleLocked} onClick={handleExcelModelOpen} style={{ background: isModuleLocked ? 'gray' : '#002D68', color: 'white', marginRight: '20px', width: '200px' }}>Import from Excel</Button>
                                    <Button variant="contained" disabled={isModuleLocked} style={{ background: isModuleLocked ? 'gray' : '#002D68', color: 'white', marginRight: '20px', width: '200px' }} onClick={handleCopyFromModelOpen}>Copy From</Button>
                                    <Button variant="contained" disabled={isModuleLocked} style={{ background: isModuleLocked ? 'gray' : '#002D68', color: 'white', marginRight: '20px', }} onClick={handleMachineDeselectModelOpen}>Machine Deselect Excel</Button>
                                    {/* <Button variant="contained" style={{ background: '#002D68', color: 'white', width: '200px' }} onClick={handleMachineDeselect}>Machine Deselect</Button> */}
                                </Grid>
                                <Grid>
                                    <Button variant="contained" style={{ width: '150px', background: isModuleLocked ? 'gray' : '#002D68', color: 'white', width: '200px' }} disabled={saveloading || isModuleLocked} onClick={handleSubmitClick}>
                                        {saveloading ? (
                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                        ) : (
                                            'Save'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <ImportFromExcelModal
                excelModal={excelModal}
                setExcelModal={setExcelModal}
            />

            <CopyFromModal
                copyFromModal={copyFromModal}
                setCopyFromModal={setCopyFromModal}
                type={'itemProcess'}
            />

            <MachineDeselectModal
                machineDeselectModal={machineDeselectModal}
                setMachineDeselectModal={setMachineDeselectModal}
            />

            <MachinePartNoList
                machinePartListModal={machinePartListModal}
                setMachinePartListModal={setMachinePartListModal}
                machineId={machineId}
                machineCode={machineCode}
                process={process}
            />

        </div>
    )
}

export default ItemVsProcess