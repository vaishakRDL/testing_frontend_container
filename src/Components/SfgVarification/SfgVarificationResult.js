import React, { useEffect, useState } from 'react'
import SfgVarificationTitle from './SfgVarificationTitle'
import { Box, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, LinearProgress, ListItemText, MenuItem, OutlinedInput, Select, Switch, TextField, Typography } from '@mui/material'
import { GetSFGFilterLocation, GetSFGVerificationInnerData, UpdateSFGVerificationInnerData, ViewSfg } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import SfgComplted from './SfgComplted';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SfgVarificationResult = () => {
    const [sfgVarificationList, setSfgVarificationList] = useState([]);
    const [filterLocationList, setFilterLocationList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([])

    const [refreshTableData, setRefreshTableData] = useState(false);
    const [updateLoader, setUpdateLoader] = useState(false);
    const [sfgAutoStatus, setSfgAutoStatus] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [totalRows, setTotalRows] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [pageSize, setPageSize] = useState(10)
    const [refreshKey, setRefreshKey] = useState(0);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [type, setType] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [displayLoader, setDispalyLoader] = useState(false);
    const [viewPage, setViewPage] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [viewSfgList, setViewSfgList] = useState([])

    const [filters, setFilters] = useState({
        "": "",
        jcNo: "",
        mrpNo: "",
        kanbanDate: "",
        sfgNo: "",
        itemCode: "",
        allocQty: "",
        producedQty: "",
        pendingQty: "",
        jwPenQty: "",
        sfgVerifiedQty: "",
        productFinish: "",
        vendorProcess: "",
        nextProcess: "",
        machineName: "",
        remarks: "",
    });

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
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SNo</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'producedDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Produced Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'orderNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Sales Order No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO/Contract No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRP No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>KANBAN Date</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'plannedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Planned Qty</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'producedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Produced Qty</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'sfgVerifiedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SFG Varified by</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'sfgVerifiedDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SFG Date</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Store Qty</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <View selectedRow={params.row} />,
        //     ],
        // },
    ];


    useEffect(() => {
        setDispalyLoader(true);
        GetSFGVerificationInnerData({ location: selectedLocation, page: 1, limit: 100, type: type ? 'VP' : 'All' }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
        GetSFGFilterLocation(handleGetLocationSuccess, handleGetLocationException);
    }, [type, refreshTableData]);

    const handleSfgVarificationSucessShow = (dataObject) => {
        setSfgVarificationList(
            (dataObject?.data || []).map(item => ({
                ...item,
                selected: item.selected ?? false
            }))
        );
        setTotalRows(dataObject?.totalRows || 0);
        setCurrentPage(dataObject?.page || 1);
        // setPageSize(dataObject?.limit || 0);
        setSelectAll(false);
        setDispalyLoader(false);
    };

    const handleSfgVarificationExceptionShow = () => {
        setDispalyLoader(false);
    }

    // GET SFG LOCATION
    const handleGetLocationSuccess = (dataObject) => {
        setFilterLocationList(dataObject?.data || [])
    }
    const handleGetLocationException = () => { }

    // TABLE EDIT
    // const handleEdit = (cellNam, newValue, id, rowData) => {
    //     switch (cellNam) {
    //         case "SELECTALL":
    //             setSelectAll(newValue);
    //             const updatedSelectAll = sfgVarificationList.map((supp) =>
    //                 ({ ...supp, selected: newValue })
    //             )
    //             setSfgVarificationList(updatedSelectAll);
    //             break;

    //         case "SELECT":
    //             const updatedSelect = sfgVarificationList.map((supp) =>
    //                 supp.id === id && cellNam === 'SELECT' ?
    //                     { ...supp, selected: newValue }
    //                     : supp
    //             )
    //             setSfgVarificationList(updatedSelect);
    //             break;

    //         case "SFGVERIFIEDQTY":
    //             const updatedSfgVerfiedQty = sfgVarificationList.map((supp) => {
    //                 if (supp.id === id && cellNam === 'SFGVERIFIEDQTY') {
    //                     if (Number(newValue) > Number(supp.producedQty)) {
    //                         // setNotification({
    //                         //     status: true,
    //                         //     type: 'error',
    //                         //     message: "Error: sfgVerifiedQty cannot be greater than producedQty.",
    //                         // });
    //                         alert("Error: sfgVerifiedQty cannot be greater than producedQty.")
    //                         return { ...supp, sfgVerifiedQty: '' }; // Reset to empty string
    //                     }
    //                     return { ...supp, sfgVerifiedQty: newValue };
    //                 }
    //                 return supp;
    //             });

    //             setSfgVarificationList(updatedSfgVerfiedQty);
    //             break;


    //         default:
    //     }
    // }

    // AUTO TOGGLE SWITCH
    const handleSwitchChange = (checked) => {
        setSfgAutoStatus(checked)
        if (checked) {
            const updatedData = sfgVarificationList.map((item) => ({ ...item, sfgVerifiedQty: item.producedQty }))
            setSfgVarificationList(updatedData)
        } else {
            const updatedData = sfgVarificationList.map((item) => ({ ...item, sfgVerifiedQty: 0 }))
            setSfgVarificationList(updatedData)
        }
    };

    //HANDLE UPDATE 
    const handleUpdateClick = () => {
        setUpdateLoader(true)
        const updatedPayloadData = filteredData.filter((row) => row.selected === true).map((row) => (
            { mrpId: row.id, vendorProcess: row.vendorProcess, sfgVerifiedQty: row.sfgVerifiedQty }
        ))
        console.log("updatedPayloadData", updatedPayloadData)
        UpdateSFGVerificationInnerData({
            mrpList: updatedPayloadData
        }, handleSelectedUpdateSucess, handleSelectedUpdateException)
    }

    const handleSelectedUpdateSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshTableData((oldvalue) => !oldvalue)
        setSelectAll(false);
        setUpdateLoader(false)
        setTimeout(() => {
            handleClose();
        }, 2000);
    }

    const handleSelectedUpdateException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setUpdateLoader(false);
    }

    const handleClose = () => {
        setUpdateLoader(false);
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // LOCATION DROPDOWN
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedLocation(
            typeof value === 'string' ? value.split(',') : value,
        );
        GetSFGVerificationInnerData({ location: typeof value === 'string' ? value.split(',') : value, page: currentPage, limit: 100, type: type ? 'VP' : 'All' }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
    };

    //TABLE FILTER FUNCTIONALITY
    // const handleFilterChange = (e, key) => {
    //     setFilters({ ...filters, [key]: e.target.value });
    // };

    // const filteredData = sfgVarificationList.filter((item) =>
    //     Object.keys(filters).every((key) =>
    //         String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
    //     )
    // );

    // const handleFilterChange = (e, key) => {
    //     setFilters({ ...filters, [key]: e.target.value });
    // };

    // const filteredData = sfgVarificationList.filter((item) =>
    //     Object.keys(filters).every((key) => {
    //         const filterValue = filters[key].replace(/\s/g, "").toLowerCase();
    //         const itemValue = String(item[key] ?? "").replace(/\s/g, "").toLowerCase();
    //         return itemValue.includes(filterValue);
    //     })
    // );

    // const filteredData = useMemo(() =>
    //     sfgVarificationList.filter((item) =>
    //         Object.keys(filters).every((key) => {
    //             const filterValue = filters[key].replace(/\s/g, "").toLowerCase();
    //             const itemValue = String(item[key] ?? "").replace(/\s/g, "").toLowerCase();
    //             return itemValue.includes(filterValue);
    //         })
    //     ),
    //     [sfgVarificationList, filters]
    // );

    // FILTER TABLE DATA
    const handleFilterChange = (e, key) => {
        setFilters({ ...filters, [key]: e.target.value });
    };

    const [filteredData, setFilteredData] = useState(() =>
        sfgVarificationList.filter((item) =>
            Object.keys(filters).every((key) => {
                const filterValue = filters[key].replace(/\s/g, "").toLowerCase();
                const itemValue = String(item[key] ?? "").replace(/\s/g, "").toLowerCase();
                return itemValue.includes(filterValue); //checks if the substring is present anywhere in the string.
                // return itemValue.startsWith(filterValue); //ensures the string begins with the provided substring.
            })
        )
    );

    useEffect(() => {
        const updatedData = sfgVarificationList.filter((item) =>
            Object.keys(filters).every((key) => {
                const filterValue = filters[key].replace(/\s/g, "").toLowerCase();
                const itemValue = String(item[key] ?? "").replace(/\s/g, "").toLowerCase();
                return itemValue.includes(filterValue);
            })
        );
        setFilteredData(updatedData);
    }, [sfgVarificationList, filters]);

    const handleEdit = (cellNam, newValue, id, rowData) => {
        switch (cellNam) {
            case "SELECTALL":
                setSelectAll(newValue);
                const updatedSelectAll = filteredData.map((supp) =>
                    ({ ...supp, selected: newValue })
                )
                setFilteredData(updatedSelectAll);
                break;

            case "SELECT":
                const updatedSelect = filteredData.map((supp) =>
                    supp.id === id && cellNam === 'SELECT' ?
                        { ...supp, selected: newValue }
                        : supp
                )
                setFilteredData(updatedSelect);
                break;

            case "SFGVERIFIEDQTY":
                const updatedSfgVerfiedQty = filteredData.map((supp) => {
                    if (supp.id === id && cellNam === 'SFGVERIFIEDQTY') {
                        if (Number(newValue) > Number(supp.producedQty)) {
                            // setNotification({
                            //     status: true,
                            //     type: 'error',
                            //     message: "Error: sfgVerifiedQty cannot be greater than producedQty.",
                            // });
                            alert("Error: sfgVerifiedQty cannot be greater than producedQty.")
                            return { ...supp, sfgVerifiedQty: '' }; // Reset to empty string
                        }
                        return { ...supp, sfgVerifiedQty: newValue };
                    }
                    return supp;
                });

                setFilteredData(updatedSfgVerfiedQty);
                break;


            default:
        }
    }

    // SHOW FILTER HEADER
    const handleMouseEnter = useCallback(() => setShowFilter(true), []);
    const handleMouseLeave = useCallback(() => setShowFilter(false), []);

    // THIS PAGINATION CODE
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50; // Adjust based on performance
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // HANDLE SUBMIT FOR VIEW
    const handleSubmit = () => {
        ViewSfg({
            fromDate: fromDate,
            toDate: toDate
        }, handleSucessShow, handleExceptionShow)
    }

    const handleSucessShow = (dataObject) => {
        setViewSfgList(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => { }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(viewSfgList);

    useEffect(() => {
        viewPage && ViewSfg({
            fromDate: fromDate,
            toDate: toDate
        }, handleSucessShow, handleExceptionShow)
    }, [viewPage]);

    return (
        <Box style={{ margin: "10px" }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography style={{ fontWeight: 'bold', fontSize: ' 20px' }}>SFG </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px', width: '100%' }}>
                        <Typography style={{ color: '#000000', fontWeight: 'bold' }}>Verification</Typography>
                        <Switch
                            checked={viewPage}
                            onChange={(e) => {
                                setViewPage(e.target.checked);
                                {
                                    viewPage &&
                                        GetSFGVerificationInnerData({ location: selectedLocation, page: 1, limit: 100, type: type ? 'VP' : 'All' }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
                                }
                            }}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#4CAF50', // Green color when checked
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#4CAF50', // Green track when checked
                                },
                                '& .MuiSwitch-switchBase': {
                                    color: '#F44336', // Red color when unchecked
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: '#F44336', // Red track when unchecked
                                }
                            }}
                        />
                        <Typography style={{ color: '#000000', fontWeight: 'bold' }}>Completed</Typography>
                    </div>
                </Grid>

                {viewPage ? (
                    // <div>
                    <SfgComplted />
                    // </div>
                ) : (
                    <>

                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px' }}>
                                <Typography style={{ color: '#000000', fontWeight: 'bold' }}>Auto SFG Verification</Typography>
                                <Switch
                                    checked={sfgAutoStatus}
                                    onChange={(e) => {
                                        handleSwitchChange(e.target.checked);
                                    }}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#4CAF50', // Green color when checked
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#4CAF50', // Green track when checked
                                        },
                                        '& .MuiSwitch-switchBase': {
                                            color: '#F44336', // Red color when unchecked
                                        },
                                        '& .MuiSwitch-track': {
                                            backgroundColor: '#F44336', // Red track when unchecked
                                        }
                                    }}
                                />
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                            <FormControl fullWidth style={{ marginTop: '3px' }}>
                                <InputLabel id="demo-multiple-checkbox-label">Location</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedLocation}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Location" />}
                                    renderValue={(selected) => {
                                        const selectedNames = filterLocationList.filter(location => selected.includes(location.id)).map(location => location.name);
                                        return selectedNames.join(', ');
                                    }}
                                    MenuProps={MenuProps}
                                    size='small'
                                >
                                    {filterLocationList.map((value, key) => (
                                        <MenuItem key={key} value={value.id}>
                                            <Checkbox checked={selectedLocation.indexOf(value.id) > -1} />
                                            <ListItemText primary={value.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px', width: '100%' }}>
                                <Typography style={{ color: '#000000', fontWeight: 'bold' }}>All</Typography>
                                <Switch
                                    checked={type}
                                    onChange={(e) => {
                                        setType(e.target.checked);
                                    }}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#4CAF50', // Green color when checked
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#4CAF50', // Green track when checked
                                        },
                                        '& .MuiSwitch-switchBase': {
                                            color: '#F44336', // Red color when unchecked
                                        },
                                        '& .MuiSwitch-track': {
                                            backgroundColor: '#F44336', // Red track when unchecked
                                        }
                                    }}
                                />
                                <Typography style={{ color: '#000000', fontWeight: 'bold' }}>Vendor Process</Typography>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={() => {
                                    handleUpdateClick();
                                }}
                            >
                                Update
                            </Button>
                        </Grid>



                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box sx={{ height: screenHeight - 265, width: '100%', overflow: 'auto', backgroundColor: '#ffffff', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', borderRadius: '8px' }}>
                                {updateLoader || displayLoader &&
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress />
                                    </Box>
                                }
                                <table id="purchase" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }}>
                                    <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                                        {showFilter &&
                                            <tr onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}>
                                                {Object.keys(filters).map((key, index) => (
                                                    <th key={index} style={{ width: "150px", whiteSpace: "nowrap" }}>
                                                        <input
                                                            type="text"
                                                            placeholder={`Filter ${key}`}
                                                            value={filters[key]}
                                                            onChange={(e) => handleFilterChange(e, key)}
                                                            style={{ width: "100%", padding: "4px", boxSizing: "border-box" }}
                                                        />
                                                    </th>
                                                ))}
                                            </tr>
                                        }
                                        <tr onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }} >
                                                <Checkbox checked={selectAll} onChange={(e) => handleEdit('SELECTALL', e.target.checked, "", "")} />
                                            </th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Job Card No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>MRP No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Kanban Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SFG No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Part No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Assigned Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Produced Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Pending Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Pending JW Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SFG Verified Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Part Finish</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Vendor Process</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Next Process Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Machine Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/*sfgVarificationList_filteredData*/paginatedData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>
                                                    <Checkbox checked={item.selected} onChange={(e) => handleEdit('SELECT', e.target.checked, item.id, item)} />
                                                </td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jcNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.mrpNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.kanbanDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sfgNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.allocQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.producedQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwPenQty}</td>
                                                <td contentEditable={true} style={{ width: '150px', whiteSpace: 'nowrap' }} onBlur={(e) => handleEdit('SFGVERIFIEDQTY', e.target.textContent, item.id, item)}>{item.sfgVerifiedQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.productFinish}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.vendorProcess}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.nextProcess}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.machineName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.remarks}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                            <div style={{ marginTop: '5px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                                <span style={{ marginLeft: '5px', marginRight: '5px' }}> {paginatedData?.length} of {sfgVarificationList?.length} | Page {currentPage} </span>
                                <button disabled={currentPage === Math.ceil(filteredData.length / pageSize)} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                            </div>
                        </Grid>
                    </>)}
            </Grid>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    )
}

export default SfgVarificationResult;