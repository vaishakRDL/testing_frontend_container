import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Radio, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import JobCardModule from './JobCardModule';
import JobCardTitle from './JobCardTitle';
import '../../App.css';
import { JobCardNumber, JobCardShow, JobCardOnSubmit, ItemSearchNAAJ } from '../../ApiService/LoginPageService';
import JobCarViewPdf from './JobCarViewPdf';
import GeneratePdfDialog from './GeneratePdfDialog';
import { JobCardExport } from '../../ApiService/DownloadCsvReportsService';

const JaobCardView = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [textStatus, setTextStatus] = useState([]);
    const [jonCardView, setJobCardView] = useState([]);
    const [kanbanDate, setkanbanDate] = useState('0');
    const [selectedValue, setSelectedValue] = useState("ItemCode");
    const [jobcardNumber, setJobcardNumber] = useState('');
    const [ItemCode, setItemCode] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [jabCardList, setJobCardList] = useState([]);
    const [JobCardViewId, setJobCardViewId] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [selectedName, setSelectedName] = useState('');

    const today = new Date();
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const TodaysDate = `${year}-${month}-${date}`;

    // useEffect(() => {
    //     // JobCardShow({ kanbanDate: kanbanDate }, JobCardShowSuccess, JobCardShowException);
    //     JobCardNumber({
    //         fromDate: fromDate,
    //         toDate: toDate,
    //     }, handleJobCardNumberSuccess, handleJobCardNumberException);

    // }, [kanbanDate, fromDate, toDate]);

    useEffect(() => {
        if (selectedValue === "JOBCARD") {
            setFromDate('');
            setToDate('');
        } else {
            setJobcardNumber('');
        }

    }, [selectedValue])

    const handleJobCardNumberSuccess = (dataObject) => {
        setJobCardList(dataObject?.data || []);
    }

    const handleJobCardNumberException = () => {

    }

    const JobCardShowSuccess = (dataObject) => {
        setJobCardView(dataObject?.data || []);
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(jonCardView);

    const JobCardShowException = () => {

    }

    const buttonStyle = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: "8px",
            backgroundColor: "#002D68",
            height: "40px",
            borderRadius: "20px",
            width: "200px",
        },
    };

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
            maxWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'id',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Id
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        {
            field: 'jcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Job Card No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName:

                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Created At
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Kanban Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'producedQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Produced Qty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'Status',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             High Escalation
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: 'Status',
        //     headerClassName: 'super-app-theme--header',
        //     type: 'actions',
        //     flex: 1,
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             High Escalation
        //         </span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <HighEscalation selectedRow={params.row} />,
        //     ],
        // },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <SatutsJobCard selectedRow={params.row} />,
        //     ],
        // },
    ];


    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                }}
            />
        );
    }


    function SatutsJobCard(props) {
        return (
            <Button
                variant="contained"
                style={{ width: '150px', background: '#002D68', color: 'white' }}
                onClick={(e) => {
                    setOpen(true);

                }}
            >
                {props?.selectedRow?.status}
            </Button>
        );
    }

    function HighEscalation(props) {
        return (
            <Button
                variant="contained"
                style={{ width: '150px', background: '#002D68', color: 'white' }}
                onClick={(e) => {


                }}
            >
                {props?.selectedRow?.High_escalation}
            </Button>
        );
    }
    useEffect(() => {

    }, [refreshData]);

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


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

    const [openPdfDialog, setOpenPdfDialog] = useState(false);
    const [pdfData, setPdfData] = useState([]);

    // Function to handle opening the PDF dialog
    const handleOpenPdfDialog = (pdfData) => {
        setOpenPdfDialog(true);
        // setJobCardViewId
    };

    // Function to handle closing the PDF dialog
    const handleClosePdfDialog = () => {
        setOpenPdfDialog(false);

        setPdfData(null);
    };

    // Function to trigger PDF generation and open the dialog
    const handleGeneratePdf = (e) => {
        // Generate or fetch the PDF data
        const generatedPdfData = {}; // Implement your PDF data fetching or generation logic here...
        handleOpenPdfDialog(generatedPdfData);
        setJobCardViewId(e.row.id || '');
    };


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        if (event.target.value === 'ItemCode') {
            setFromDate('');
            setToDate('');
        } else {
            setSelectedName('');
        }
    };

    const options = itemShowListSeach.map(item => ({
        id: item?.id,
        label: item?.label
    }));

    const handleAutocompleteChange = (selectedValue) => {
        // const selectedItem = itemShowList.find(item => item.id === selectedValue?.id);
        // setItemShowList(selectedItem ? [selectedItem] : []);
        // setItemSelected(selectedValue?.id)
        setSelectedName(selectedValue?.label);

    };

    const onSubmit = (e) => {
        e.preventDefault();
        JobCardOnSubmit({
            fromDate: TodaysDate,
            toDate: TodaysDate,
            itemCode: selectedName
        }, handleJobCardSubmitSuccess, handleJobCardSubmitException);
    }

    const handleJobCardSubmitSuccess = (dataObject) => {
        setJobCardView(dataObject?.data || []);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const handleJobCardSubmitException = () => {

    }

    const textEntery = (e) => {

        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }

    const handleJobCardExportSucces = () => {

    }

    const handleJobCardExportException = () => { }
    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <JobCardTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}

            />
            {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}> */}
            {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent> */}
            <form onSubmit={onSubmit}>
                <Grid container spacing={2} style={{ padding: '10px', marginTop: '-40px' }}>
                    {/* <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <TextField
                        id="filled-basic"
                        label="From Date"
                        variant="filled"
                        type='date'
                        fullWidth
                        required
                        value={kanbanDate}
                        InputLabelProps={{ shrink: true }}
                        placeholder="From Date"
                        onChange={(e) => {
                            setkanbanDate(e.target.value);
                        }}

                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <TextField
                        id="filled-basic"
                        label="To Date"
                        variant="filled"
                        type='date'
                        fullWidth
                        required
                        value={kanbanDate}
                        InputLabelProps={{ shrink: true }}
                        placeholder="To Date"
                        onChange={(e) => {
                            setkanbanDate(e.target.value);
                        }}

                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <FormControl fullWidth
                    >
                        <InputLabel id="demo-simple-select-label">Part Number</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={TypesScheduling}
                            label="Customer Name"
                            variant="filled"
                        // onChange={OnChangeType}
                        >
                            <MenuItem value={'Pending Order'}>Pending Order</MenuItem>
                            <MenuItem value={'Scheduled_and_Process Order'}>Scheduled and Process Order</MenuItem>
                            <MenuItem value={'Hold'}>Hold</MenuItem>
                            <MenuItem value={'All'}>All</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Button variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }} onClick={''}>Submit</Button>
                </Grid> */}

                    <Grid item xs={12} sm={12} md={8} lg={8} xl={8} style={{ display: "flex", flexDirection: "row" }} >
                        {/* <Radio
                        checked={selectedValue === "JOBCARD"}
                        onChange={handleChange}
                        value="JOBCARD"
                        name="radio-buttons"
                        inputProps={{ "aria-label": "A" }}
                    />
                    <FormControl style={{ width: '100%' }}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            id="combo-box-demo"
                            options={options}
                            value={jobcardNumber}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Search By Jobcard number"
                            // onChange={textEntery}
                            />}
                            onChange={(event, value) => handleAutocompleteChange(value)}
                            disabled={selectedValue === "DATE" || selectedValue === "Machine" ? true : false}
                        />
                    </FormControl> */}
                        <Radio
                            checked={selectedValue === "ItemCode"}
                            onChange={handleChange}
                            value="ItemCode"
                            name="radio-buttons"
                            inputProps={{ "aria-label": "A" }}
                        />
                        <FormControl style={{ width: '100%' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                required
                                size='small'
                                value={selectedName}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By Item Code"
                                    onChange={textEntery}
                                />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                                disabled={selectedValue === "DATE" || selectedValue === "JOBCARD" ? true : false}
                            />
                        </FormControl>
                        {/* <TextField
                        fullWidth
                        id="Jobcard number"
                        placeholder="Jobcard number"
                        variant="outlined"
                        label='JOBCARD'
                        
                        style={{ color: "#000000" }}

                        onChange={(e) => {
                           
                        }}
                       
                    /> */}
                        <Radio
                            checked={selectedValue === "DATE"}
                            onChange={handleChange}
                            value="DATE"

                            name="radio-buttons"
                            inputProps={{ "aria-label": "B" }}
                        />
                        <TextField
                            fullWidth
                            id="Date"
                            placeholder="Date"
                            type="date"
                            label='From Date'
                            value={fromDate}
                            required
                            size='small'
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            onChange={(e) => {
                                setFromDate(e.target.value);
                            }}
                            disabled={selectedValue === "JOBCARD" || selectedValue === "ItemCode" ? true : false}
                            style={{ color: "#000000", marginRight: "10px" }}
                        />
                        <TextField
                            fullWidth
                            id="Date"
                            placeholder="Date"
                            type="date"
                            label='To Date'
                            required
                            size='small'
                            value={toDate}
                            onChange={(e) => {
                                setToDate(e.target.value);
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            style={{ color: "#000000" }}
                            disabled={selectedValue === "JOBCARD" || selectedValue === "ItemCode" ? true : false}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                        lg={1}
                        xl={1}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}

                    >
                        <Button variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type='submit'>
                            Today
                        </Button>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                        lg={1}
                        xl={1}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}

                    >
                        <Button variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                JobCardOnSubmit({
                                    fromDate: fromDate,
                                    toDate: toDate,
                                    itemCode: selectedName
                                }, handleJobCardSubmitSuccess, handleJobCardSubmitException);
                            }}
                        >
                            Submit
                        </Button>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={2}
                        lg={1}
                        xl={1}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}

                    >
                        <Button
                            onClick={() => {
                                JobCardExport({
                                    fromDate: fromDate,
                                    toDate: toDate,
                                    itemCode: selectedName
                                }, handleJobCardExportSucces, handleJobCardExportException);
                            }} variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >Download</Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{ borderRadius: '8px', marginTop: '0px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)", overflow: 'hidden', height: '100%' }}>
                            <CardContent style={{ padding: '0', height: '100%' }}>
                                <div style={{ overflowX: 'auto', padding: '0', minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            onRowClick={handleGeneratePdf}
                                            disableSelectionOnClick
                                            style={{
                                                border: 'none',
                                                fontWeight: 'bold',
                                                // minWidth: '50%',
                                                height: '65vh',
                                                fontFamily: 'Arial',// Set the font family to Arial
                                            }}
                                            sx={{
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
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = rowData.findIndex(row => row.id === params.row.id);
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
                                    </Box>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>

            {/* </CardContent>
                </Card> */}

            {/* <Button onClick={handleGeneratePdf}>Generate PDF</Button> */}
            {/* Render PDF dialog */}
            <GeneratePdfDialog open={openPdfDialog} handleClose={handleClosePdfDialog} pdfData={pdfData} JobCardViewId={JobCardViewId} />


            {/* </div> */}

            <JobCardModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            />

            {/* <JobCarViewPdf /> */}

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
                // deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default JaobCardView
