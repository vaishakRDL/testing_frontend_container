import { Autocomplete, Button, CircularProgress, Card, CardContent, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download';
import { OperatorlogShow, OperatorlogShowdropdown} from '../../ApiService/LoginPageService';

const OperatorLog = ({ setIsOperatorLog }) => {
    const [searchloading, setsearchLoading] = useState(false);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [type, setType] = useState('operator');
    const [dataShow, setDataShow] = useState([]);
    const [operatorMachine, setOperatorMachine] = useState([]);
    const [operatorId, setOperatorId] = useState('');
    const [selectedDate, setSelectedData] = useState('');

    const [id, setId] = useState('');

    const options = operatorMachine.map(item => ({
        id: item?.Id,
        label: item?.fieldName,
        operatorId: item?.operatorId || ''
    }));

    const textEntery = (e) => {

    }

    const handleAutocompleteChange = (selectedValue) => {
        console.log("selectedValue==>", selectedValue);

        if (type === 'operator') {
            setOperatorId(selectedValue?.operatorId || '');
            setSelectedData(selectedValue?.label);
        } else {
            setId(selectedValue?.id || '');
            setSelectedData(selectedValue?.label);
        }
    };

    useEffect(() => {
        OperatorlogShowdropdown({
            filterType: type
        }, handleOperatorlogShowdropdownSuccess, handleOperatorlogShowdropdownException)
    }, [type]);

    const handleOperatorlogShowdropdownSuccess = (dataObject) => {
        setOperatorMachine(dataObject?.data || []);
    }

    const handleOperatorlogShowdropdownException = () => {

    }

    const onSreachClicked = () => {
        setsearchLoading(true)
        OperatorlogShow({
            filterType: type,
            operatorId: operatorId,
            fromDate: fromDate,
            toDate: toDate,
            id: id,
        }, handleOperatorlogShowSuccess, handleOperatorlogShowException);
    }

    const handleOperatorlogShowSuccess = (dataObject) => {
        setDataShow(dataObject?.data || []);
        setsearchLoading(false)

    }

    const handleOperatorlogShowException = () => {
        setsearchLoading(false)

    }

    const columns = [
        {
            field: 'operatorName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Operator Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'operatorID',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Operator Id
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'machine_tag',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Machine
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'departmentName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Department
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'login_date',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Login Date
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'login_time',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Login Time
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'logout_time',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Logout Time
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'total_Time',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Total
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerClassName: 'super-app-theme--header',
        //     flex: 1,
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <DownloadData selectedRow={params.row} />,
        //     ],
        // },
    ];

    function DownloadData(props) {
        return (
            <DownloadIcon
                // style={{ color: userPermission[0]?.updateData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    // if (userPermission[0]?.updateData === 1) {
                    //     setEditOpen(true);
                    //     // setIsAddButton(false);
                    //     setEditData(props.selectedRow);
                    // }
                }}
            />
        );
    }

    return (
        <div>
            <Grid container spacing={2} style={{ padding: '20px', marginTop: '-20px' }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography
                        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {
                            type === 'operator' ? " Operator Log" : " Machine Log Report"

                        }

                    </Typography>

                </Grid>
                <Grid item xs={12} sm={12} md={2.5} letterSpacing={2.5} xl={2.5} style={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={(e) => {
                                setType(e.target.value);
                                setSelectedData(" ");
                            }}
                            value={type}
                        >
                            <FormControlLabel value="operator" control={<Radio />} label="Operator" />
                            <FormControlLabel value="machine" control={<Radio />} label="Machine" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={2.5} letterSpacing={2.5} xl={2.5}>
                    <TextField
                        fullWidth
                        label="From Date"
                        placeholder='From Date'
                        variant="filled"
                        size='small'
                        // required
                        value={fromDate}
                        InputLabelProps={{
                            shrink: true
                        }}
                        type='date'
                        onChange={(e) => setFromDate(e.target.value || '')}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2.5} letterSpacing={2.5} xl={2.5}>
                    <TextField
                        fullWidth
                        label="To Date"
                        placeholder='To Date'
                        variant="filled"
                        size='small'
                        // required
                        value={toDate}
                        InputLabelProps={{
                            shrink: true
                        }}
                        type='date'
                        onChange={(e) => setTodate(e.target.value || '')}
                    />
                </Grid>
                {
                    type === 'operator' ? (
                        <Grid item xs={12} sm={12} md={2.5} letterSpacing={2.5} xl={2.5}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={options}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField value={selectedDate} variant="filled" {...params} label="Select Operator"
                                    // onChange={textEntery}
                                    />}
                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                />
                            </FormControl>
                        </Grid>
                    ) : (
                        <Grid item xs={12} sm={12} md={2.5} letterSpacing={2.5} xl={2.5}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={options}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField value={selectedDate} variant="filled" {...params} label="Select Machine"
                                    // onChange={textEntery}
                                    />}
                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                />
                            </FormControl>
                        </Grid>
                    )
                }

                <Grid item xs={12} sm={12} md={2} letterSpacing={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white', margin: '10px', }}
                        onClick={onSreachClicked}
                        disabled={searchloading}
                    >
                        {searchloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            "Search"
                        )}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12} md={12} letterSpacing={12} xl={12}>
                    <Card style={{ marginTop: '-15px', minHeight: '450px' }}>
                        <CardContent>
                            <DataGrid
                                rows={dataShow}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ fontWeight: 'bold' }}
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
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696', // Add border to column headers
                                    },
                                }}
                                getRowClassName={(params) => {
                                    // Find the index of the row within the rows array
                                    const rowIndex = dataShow.findIndex(row => row.id === params.row.id);
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
            <Grid style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-15px' }}>
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white', margin: '10px', }}
                    onClick={(e) => {
                        setIsOperatorLog(false);
                    }}
                >
                    Download
                </Button>
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white', margin: '10px', }}
                    onClick={(e) => {
                        setIsOperatorLog(false);
                    }}
                >
                    Cancel
                </Button>
            </Grid>
        </div>
    )
}

export default OperatorLog