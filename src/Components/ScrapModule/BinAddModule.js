import {
    Button, Box, Dialog, Tooltip, DialogContent, CircularProgress, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    Autocomplete,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, ScrapMstBinShow, ScrapMstBinUpdate, ScrapMstCategory, ScrapMstMaterial, ScrapMstShowType, ScrapMstStoreBin, ScrapeMaster, ScrapeMasterUpdate, SobUpdate, } from '../../ApiService/LoginPageService';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

const BinAddModule = ({ open, setOpen, }) => {
    const [types, setTypes] = useState('Category');
    const [listType, setListType] = useState([]);
    const [scrapMstId, setScrapMstId] = useState('');
    const [scrapName, setScrapName] = useState('');
    const [viewloading, setviewLoading] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');

    const [rawMaterialId, setRawMaterialId] = useState('');
    const [rawMaterialName, setRawMaterialName] = useState('');

    const [scrapMstLable, setScrapMstLable] = useState('');
    const [weight, setWeight] = useState('');
    const [addButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [dataList, setDataList] = useState([]);

    const [categoryList, setCategoryList] = useState([]);
    const [materialList, setMaterialList] = useState([]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const ClearData = () => {
        setTypes('Category');
        setScrapMstId('');
        setScrapName('');
        setWeight('');
        setOpen(false);
        setEditData([]);
    }


    const onScrapeMasterAdd = (e) => {
        setviewLoading(true)
        e.preventDefault();
        if (addButton) {
            ScrapMstStoreBin({
                category: categoryName,
                rawMaterial: rawMaterialName,
                weight: weight
            }, handleScrapMstStoreBinSuccess, handleScrapMstStoreBinException);
        } else {
            ScrapMstBinUpdate({
                id: editData?.id,
                category: categoryName,
                rawMaterial: rawMaterialName,
                weight: weight
            }, handleScrapMstStoreBinSuccess, handleScrapMstStoreBinException);
        }
    }

    const handleScrapMstStoreBinSuccess = (dataObject) => {
        setviewLoading(false)

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            ClearData();
        }, 3000);
    }

    const handleScrapMstStoreBinException = (errorObject, errorMessage) => {
        setviewLoading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            // ClearData();
        }, 3000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Category
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rawMaterial',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Raw Material
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'weight',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Bin Weight
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerClassName: 'super-app-theme--header',
            flex: 1,
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
            ],
        },

    ];

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                    setScrapName(props.selectedRow?.name || '');
                    setCategoryName(props.selectedRow.category || '');
                    setRawMaterialName(props.selectedRow.rawMaterial || '');

                }}
            />
        );
    }

    useEffect(() => {
        if (open) {
            ScrapMstBinShow(handleScrapMstBinShow, handleScrapMstBinShowException);
            ScrapMstCategory(handletypeSuccess, handletypeException);
            ScrapMstMaterial(handleScrapMstBinShowSuccess, handleScrapMstBinShowException);
        }
    }, [open]);

    const handleScrapMstBinShow = (dataObject) => {
        setDataList(dataObject?.data || [])
    }

    useEffect(() => {
        // setTypes(editData?.type || 'Category');
        // setScrapMstLable(() => (
        //     options.some(data => data?.id === editData?.scrapMstId) ? options.find(data => data?.id === editData?.scrapMstId)?.label : undefined
        // ));

        // setScrapMstId(editData?.id || '');
        // const [categoryId, setCategoryId] = useState('');

        setWeight(editData?.weight || '');
    }, [editData]);



    const handleScrapMstBinShowSuccess = (dataObject) => {
        setMaterialList(dataObject?.data || []);
    }

    const handleScrapMstBinShowException = (errorObject, errorMessage) => {

    }
    const category = categoryList.map(item => ({
        // id: item?.id,
        label: item?.name
    }));

    const material = materialList.map(item => ({
        // id: item?.id,
        label: item?.name
    }));



    const handleAutocompleteChange = (selectedValue) => {
        setCategoryId(selectedValue?.id || '');
        setCategoryName(selectedValue?.label || '');
        console.log("selectedValue?.name ", selectedValue)
    };

    const handleAutocompleteChange1 = (selectedValue) => {
        setRawMaterialId(selectedValue?.id || '');
        setRawMaterialName(selectedValue?.label || '');
    };

    const handletypeSuccess = (dataObject) => {
        setCategoryList(dataObject?.data || []);
    }

    const handletypeException = () => {

    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Add Bin Weight
            </DialogTitle>
            <form onSubmit={onScrapeMasterAdd}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={6} xl={6}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={category}
                                    // value={categoryId}
                                    value={categoryName}
                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            // value={categoryName}
                                            {...params}
                                            variant="filled"
                                            label="Select Category"
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} xl={6}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={material}
                                    value={rawMaterialName}
                                    onChange={(event, value) => handleAutocompleteChange1(value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="filled"
                                            label="Select Raw Material"
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label=" Bin Weight"
                                placeholder=' Bin Weight'
                                variant="filled"
                                size='small'
                                value={weight}
                                onChange={(e) => {
                                    setWeight(e.target.value);
                                }}
                                required

                            />

                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <Box
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={dataList}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '40vh',
                                        // minHeight: '500px',
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
                                    getRowClassName={(params) => {
                                        // Find the index of the row within the rows array
                                        const rowIndex = [].findIndex(row => row.id === params.row.id);
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
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type='submit'
                        disabled={viewloading}
                    >
                        {viewloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            'Bin Weight'
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            ClearData();
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

            </form>
        </Dialog>
    )
}

export default BinAddModule
